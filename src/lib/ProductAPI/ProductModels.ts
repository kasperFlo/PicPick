// Define the interface for your product listing information
interface ProductListingInfo {
  name: string;
  price: {
    value: number;
    currency: string;
    formatted: string;
  };
  seller: string;
  platform: string;
  link: string;
  image: string;
  rating?: {
    value: number;
    count: number;
  };
  shipping?: string;
  condition?: string;
}
