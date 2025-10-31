import { CategoryMenu, Hero, IntroducingSection, FeaturedProductsSlider } from "@/components";
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="page-blue">
      <Hero />
      <FeaturedProductsSlider />
      <CategoryMenu />
      <div className="section-gradient">
        <IntroducingSection />
      </div>
    </div>
  );
}
