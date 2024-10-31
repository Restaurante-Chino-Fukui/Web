import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-gray-100">
      <Header />
      <main className="flex-1 w-full">
        <Hero />
        <Menu />
      </main>
      <Footer />
    </div>
  );
}
