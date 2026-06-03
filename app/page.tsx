import { getLandingPageData } from "@/lib/landing-data";
import { LandingPage } from "@/components/marketing/landing-page";

export default async function HomePage() {
  const { settings, categories, featuredProducts } =
    await getLandingPageData();

  return (
    <LandingPage
      settings={settings}
      categories={categories}
      featuredProducts={featuredProducts}
    />
  );
}
