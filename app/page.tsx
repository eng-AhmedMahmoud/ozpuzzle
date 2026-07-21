import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Collections from "@/components/Collections";
import PuzzleGallery from "@/components/PuzzleGallery";
import Products from "@/components/Products";
import CustomCta from "@/components/CustomCta";
import Story from "@/components/Story";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Marquee />
      <Collections />
      <PuzzleGallery />
      <Products />
      <CustomCta />
      <Story />
      <Footer />
    </main>
  );
}
