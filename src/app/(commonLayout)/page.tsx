import AIShowcase from "@/components/modules/Nexora/AIShowcase";
import CategoryShowcase from "@/components/modules/Nexora/CategoryShowcase";
import FeaturedProducts from "@/components/modules/Nexora/FeaturedProducts";
import Hero from "@/components/modules/Nexora/Hero";
import MarqueeBrands from "@/components/modules/Nexora/MarqueeBrands";
import Newsletter from "@/components/modules/Nexora/Newsletter";
import Spotlight from "@/components/modules/Nexora/Spotlight";
import Testimonials from "@/components/modules/Nexora/Testimonials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeBrands />
      <FeaturedProducts />
      <Spotlight />
      <CategoryShowcase />
      <AIShowcase />
      <Testimonials />
      <Newsletter />
    </>
  );
}
