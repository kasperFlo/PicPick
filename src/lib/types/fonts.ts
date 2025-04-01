import { Poppins , Epilogue} from "next/font/google";

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-epilogue',
});
