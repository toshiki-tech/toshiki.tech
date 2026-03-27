import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Locale, getDictionary } from "@/lib/get-dictionary";

export default async function SiteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const dict = await getDictionary(params.lang);

  return (
    <>
      <Navbar lang={params.lang} dict={dict} />
      <main className="min-h-screen pt-24">
        {children}
      </main>
      <Footer lang={params.lang} dict={dict} />
    </>
  );
}
