import { HeroSection } from "./(section)/HeroSection";
import { ProductSection } from "./(section)/ProductSection";
import { Products } from "./index.data";

export default function Product() {
  return (
    <>
      <HeroSection />
      {Products.map((item) => (
        <ProductSection key={item.id} data={item} />
      ))}
    </>
  );
}
