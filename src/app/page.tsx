import ProductCard from "@/components/ProductCard";
import AnimatedContainer from "@/components/AnimatedContainer";
import products from "@/data/products.json";
import BookAnimation from "@/components/bookAnimation";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <div className="flex items-center justify-center gap-4 p-6">
        <div className="bg-amber-600 px-6 py-3 rounded flex items-center gap-4">
          <h1 className="text-4xl sm:text-6xl font-bold text-white text-center">
            Lojinha Gamificada
          </h1>
          <BookAnimation />
        </div>
      </div>

      <AnimatedContainer>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatedContainer>
    </main>
  );
}
