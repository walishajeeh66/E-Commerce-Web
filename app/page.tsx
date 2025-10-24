import { CategoryMenu, Hero, Incentives, IntroducingSection, Newsletter, ProductsSection } from "@/components";

export default function Home() {
  return (
    <div className="page-blue">
      <Hero />
      <div className="section-gradient">
        <IntroducingSection />
      </div>
      <div className="section-gradient">
        <ProductsSection />
      </div>
      <CategoryMenu />
    </div>
  );
}
