import { NextRequest, NextResponse } from 'next/server';

// This API route handles GET requests to fetch Google Shopping data via SerpApi
export async function GET(request: NextRequest) {
  console.log('Fetching data from Google Shopping (SerpApi)...');
  
  try {
    // 1) Parse query string param "q"
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'laptop';
    
    // 2) Build the SerpApi URL
    //    We can add additional parameters (like gl=us, hl=en, etc.) if needed.
    const serpApiKey = process.env.SERPAPI_KEY;
    if (!serpApiKey) {
      return NextResponse.json(
        { error: 'Missing SERPAPI_KEY in environment variables.' },
        { status: 500 }
      );
    }
    
    // For a reference of all parameters, see:
    // https://serpapi.com/google-shopping-api
    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.set('engine', 'google_shopping'); // mandatory
    serpApiUrl.searchParams.set('q', query);                  // your search
    serpApiUrl.searchParams.set('api_key', serpApiKey);       // your key
    serpApiUrl.searchParams.set('gl', 'ca'); // country
    
    

    console.log('SerpApi request:', serpApiUrl.toString());
    
    // 3) Fetch data from SerpApi
    const response = await fetch(serpApiUrl.toString(), {
      method: 'GET'
    });
    
    if (!response.ok) {
      throw new Error(`SerpApi request failed with status ${response.status}`);
    }
    
    // 4) Get JSON and return
    const data = await response.json();
    return NextResponse.json({
      success: true,
      query,
      results: data
    });
    
  } catch (error) {
    console.error('Error fetching Google Shopping results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Google Shopping data' },
      { status: 500 }
    );
  }
}
