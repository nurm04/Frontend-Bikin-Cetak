import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="light">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}