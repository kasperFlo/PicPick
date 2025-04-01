// File: /src/lib/ProductAPI/ProductPullerManager.ts

import { ProductListingInfo } from './ProductModels';

/**
 * ========== fetchProductListings ==========
 * Main aggregator function. Right now it only calls pullFromGoogle().
 */
export async function fetchProductListings(query: string): Promise<ProductListingInfo[]> {
  const googleData = await pullFromGoogle(query);
  return googleData;
}

/**
 * ========== pullFromGoogle ==========
 * Calls SerpApi with direct_link=true, retries once if 429, and returns parsed results.
 */
async function pullFromGoogle(query: string): Promise<ProductListingInfo[]> {
  const serpApiKey = process.env.SERPAPI_KEY;
  if (!serpApiKey) {
    console.error('SERPAPI_KEY not found in environment variables');
    return [];
  }

  const url = new URL('https://serpapi.com/search.json');
  url.searchParams.set('engine', 'google_shopping');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', serpApiKey);
  url.searchParams.set('direct_link', 'true');

  try {
    let response = await fetch(url.toString(), { method: 'GET' });

    // Retry once if 429
    if (response.status === 429) {
      // Minimal log for 429
      console.warn('Got 429 from SerpApi, waiting 5s then retrying once...');
      await new Promise((res) => setTimeout(res, 5000));
      response = await fetch(url.toString(), { method: 'GET' });

      if (response.status === 429) {
        console.error('Still 429 after retry; returning empty array.');
        return [];
      }
    }

    if (!response.ok) {
      console.error(`SerpApi request failed with status ${response.status}`);
      return [];
    }

    const data = await response.json();
    return parseSerpApiResponse(data);
  } catch (error) {
    console.error('Error in pullFromGoogle:', error);
    return [];
  }
}

/**
 * ========== parseSerpApiResponse ==========
 * Merges relevant arrays from SerpApi, checks sub-fields, and attempts
 * to extract a real store link from any Google redirect. Falls back to Amazon.
 */
function parseSerpApiResponse(data: any): ProductListingInfo[] {
  const rawShopping = data.shopping_results ?? [];
  const rawInline = data.inline_shopping_results ?? [];
  const rawFeatured = data.featured_shopping_results ?? [];
  const combined = [...rawShopping, ...rawInline, ...rawFeatured];

  return combined.map((item: any) => {
    // Basic details
    const name = item.title ?? 'No Title';
    const brand = item.brand ?? '';
    const combinedName =
      brand && !name.toLowerCase().includes(brand.toLowerCase())
        ? `${brand} ${name}`.trim()
        : name;

    const extractedPrice = item.extracted_price ?? 0;
    const rawPriceString = item.price ?? `$${extractedPrice}`;
    const currency = rawPriceString.includes('$') ? 'USD' : 'CAD';

    const seller = item.source || 'Unknown Seller';
    const ratingValue = item.rating ?? 0;
    const ratingCount = item.reviews ?? 0;
    const shipping = item.delivery ?? item.shipping ?? 'N/A';
    const condition = item.condition || item.second_hand_condition || 'New';
    const image = item.thumbnail ?? '';

    // Start with product_link or link
    let finalLink = item.product_link || item.link || '';

    // Helper to detect google in domain
    function isGoogleDomain(urlString: string): boolean {
      try {
        const parsed = new URL(urlString);
        return parsed.hostname.toLowerCase().includes('google');
      } catch {
        return false;
      }
    }

    // 1) If finalLink is google or empty, check subfields
    if (!finalLink || isGoogleDomain(finalLink)) {
      if (Array.isArray(item.sellers) && item.sellers.length > 0) {
        const potentialSellerLink = item.sellers[0].link;
        if (potentialSellerLink && !isGoogleDomain(potentialSellerLink)) {
          finalLink = potentialSellerLink;
        }
      }
    }
    if (!finalLink || isGoogleDomain(finalLink)) {
      if (Array.isArray(item.buying_options) && item.buying_options.length > 0) {
        const buyOptLink = item.buying_options[0].link;
        if (buyOptLink && !isGoogleDomain(buyOptLink)) {
          finalLink = buyOptLink;
        }
      }
    }
    if (!finalLink || isGoogleDomain(finalLink)) {
      if (
        Array.isArray(item.inline_seller_listings) &&
        item.inline_seller_listings.length > 0
      ) {
        const inlineLink = item.inline_seller_listings[0].link;
        if (inlineLink && !isGoogleDomain(inlineLink)) {
          finalLink = inlineLink;
        }
      }
    }

    // 2) If still google, parse out real link in param
    if (isGoogleDomain(finalLink)) {
      const possibleRealLink = extractStoreLinkFromGoogleRedirect(finalLink);
      if (possibleRealLink && !isGoogleDomain(possibleRealLink)) {
        finalLink = possibleRealLink;
      }
    }

    // 3) If STILL google or empty => Amazon fallback
    if (!finalLink || isGoogleDomain(finalLink)) {
      finalLink = `https://www.amazon.com/s?k=${encodeURIComponent(combinedName)}`;
    }

    // Build the final ProductListingInfo
    return {
      name: combinedName,
      price: {
        value: extractedPrice,
        currency,
        formatted: rawPriceString,
      },
      seller,
      platform: 'GoogleShopping',
      link: finalLink,
      image,
      rating: ratingValue > 0 ? { value: ratingValue, count: ratingCount } : undefined,
      shipping,
      condition,
    };
  });
}

/**
 * Attempt to parse store link from google.com/url?url=... or adurl=..., etc.
 */
function extractStoreLinkFromGoogleRedirect(googleUrl: string): string | null {
  try {
    const parsed = new URL(googleUrl);
    // Potential param keys that contain the real store link
    const candidateParams = ['url', 'adurl', 'q'];
    for (const paramKey of candidateParams) {
      const paramVal = parsed.searchParams.get(paramKey);
      if (paramVal) {
        return decodeURIComponent(paramVal);
      }
    }
    return null;
  } catch {
    return null;
  }
}
