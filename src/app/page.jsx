import Hero from '@/components/Hero';
import FandomStrip from '@/components/FandomStrip';
import CategoryTiles from '@/components/CategoryTiles';
import ProductGrid from '@/components/ProductGrid';
import ClubBanner from '@/components/ClubBanner';
import TryOnStudio from '@/components/TryOnStudio';

export default function Home() {
  return (
    <>
      <Hero />
      <FandomStrip />
      <CategoryTiles />
      <ProductGrid />
      <ClubBanner />
      <TryOnStudio />
    </>
  );
}
