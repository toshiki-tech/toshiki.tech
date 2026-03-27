import { Inter } from "next/font/google";
import "../globals.css";
import { Locale } from "@/lib/get-dictionary";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }, { lang: 'ja' }, { lang: 'zh-tw' }]
}

export async function generateMetadata({ params }: { params: { lang: Locale } }) {
  return {
    title: `Toshiki Tech | ${params.lang.toUpperCase()} | Building real-world products`,
    description: "Building software products, browser tools, and applied AI systems. Based in Tokyo.",
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  return (
    <html lang={params.lang} className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
