import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Locale, getDictionary } from "@/lib/get-dictionary";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'zh' }, { lang: 'ja' }]
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
  const dict = await getDictionary(params.lang);

  return (
    <html lang={params.lang} className="scroll-smooth">
      <body className={inter.className}>
        <Navbar lang={params.lang} dict={dict} />
        <main className="min-h-screen pt-24">
          {children}
        </main>
        <Footer lang={params.lang} dict={dict} />
      </body>
    </html>
  );
}
