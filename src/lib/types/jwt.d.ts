// types/jwt.d.ts
import 'jwt-decode';

declare module 'jwt-decode' {
  interface JwtPayload {
    name?: string;
    email?: string;
    picture?: string;
  }
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: { theme: string; size: string }) => void;
        };
      };
    };
  }
}
