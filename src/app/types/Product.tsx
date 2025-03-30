export type Product = {
    _id: string;
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
  };
  