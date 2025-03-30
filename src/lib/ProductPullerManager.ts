// File: /src/lib/ProductAPI/ProductPullerManager.ts

import { ProductListingInfo } from './ProductAPI/ProductModels';


/**
 * ========== fetchProductListings ==========
 * Main aggregator function. Right now it only calls pullFromGoogle(),
 * but you could add other sources in parallel if you like.
 */
export async function fetchProductListings(query: string): Promise<ProductListingInfo[]> {
  // For example, you might have multiple data sources:
  // const [googleData, someOtherData] = await Promise.all([
  //   pullFromGoogle(query),
  //   pullFromSomeOtherAPI(query),
  // ]);
  // return [...googleData, ...someOtherData];

  const googleData = await pullFromGoogle(query);
  return googleData;
}

/**
 * ========== pullFromGoogle ==========
 * 1) Calls SerpApi's Google Shopping endpoint with direct_link=true
 * 2) Retries once if we get 429 (Too Many Requests)
 * 3) Maps results into ProductListingInfo
 * 4) If a link is still going to any google.* domain, tries sub-fields,
 *    then falls back to Amazon
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
  url.searchParams.set('direct_link', 'true'); // request direct store links if available

  console.log(`pullFromGoogle() -> ${url.toString()}`);

  try {
    // 1) Fetch from SerpApi
    let response = await fetch(url.toString(), { method: 'GET' });

    // 2) If we get 429, wait 5 seconds and retry once
    if (response.status === 429) {
      console.warn('Got 429 from SerpApi, waiting 5s then retrying once...');
      await new Promise((resolve) => setTimeout(resolve, 5000));

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
 *  - Collects results from shopping_results, inline_shopping_results, featured_shopping_results
 *  - Checks multiple sub-fields (sellers, buying_options, inline_seller_listings) for direct store links
 *  - Falls back to Amazon if the link is still a Google domain
 */
function parseSerpApiResponse(data: any): ProductListingInfo[] {
  // Merge all relevant arrays from the SerpApi JSON
  const rawShopping = data.shopping_results ?? [];
  const rawInline = data.inline_shopping_results ?? [];
  const rawFeatured = data.featured_shopping_results ?? [];
  const combined = [...rawShopping, ...rawInline, ...rawFeatured];

  return combined.map((item: any) => {
    // Basic name & brand
    const name = item.title ?? 'No Title';
    const brand = item.brand ?? '';
    const combinedName = brand && !name.toLowerCase().includes(brand.toLowerCase())
      ? `${brand} ${name}`.trim()
      : name;

    // Price
    const extractedPrice = item.extracted_price ?? 0;
    const rawPriceString = item.price ?? `$${extractedPrice}`;
    const currency = rawPriceString.includes('$') ? 'USD' : 'CAD';

    // Other fields
    const seller = item.source || 'Unknown Seller';
    const ratingValue = item.rating ?? 0;
    const ratingCount = item.reviews ?? 0;
    const shipping = item.delivery ?? item.shipping ?? 'N/A';
    const condition = item.condition || item.second_hand_condition || 'New';
    const image = item.thumbnail ?? '';

    // Start with product_link or link
    let finalLink = item.product_link || item.link || '';

    // Check if finalLink is a Google domain
    function isGoogleDomain(urlString: string): boolean {
      try {
        const parsed = new URL(urlString);
        return parsed.hostname.toLowerCase().includes('google');
      } catch {
        return false;
      }
    }

    // 1) If finalLink is still google or empty, check item.sellers
    if (!finalLink || isGoogleDomain(finalLink)) {
      if (Array.isArray(item.sellers) && item.sellers.length > 0) {
        const potentialSellerLink = item.sellers[0].link;
        if (potentialSellerLink && !isGoogleDomain(potentialSellerLink)) {
          finalLink = potentialSellerLink;
        }
      }
    }

    // 2) If still google or empty, check item.buying_options
    if (!finalLink || isGoogleDomain(finalLink)) {
      if (Array.isArray(item.buying_options) && item.buying_options.length > 0) {
        const buyOptLink = item.buying_options[0].link;
        if (buyOptLink && !isGoogleDomain(buyOptLink)) {
          finalLink = buyOptLink;
        }
      }
    }

    // 3) If still google or empty, check item.inline_seller_listings
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

    // 4) If STILL google or empty, fallback to Amazon with brand + name
    if (
      !finalLink ||
      finalLink.includes('google.com') ||
      finalLink.includes('googleadservices.com') ||
      finalLink.includes('google.') || // for google.ca, google.co.uk, etc.
      finalLink.includes('google') 
    ) {
      finalLink = `https://www.amazon.com/s?k=${encodeURIComponent(name)}`;
    }
    

    // Construct the final ProductListingInfo
    const product: ProductListingInfo = {
      name: combinedName, // brand + title if distinct
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

    return product;
  });
}

