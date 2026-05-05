import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Carta from "@/components/Carta";

import Ubicacion from "@/components/Ubicacion";
import { Analytics } from "@vercel/analytics/react"
import Footer from "@/components/Footer";
import Menus from "@/components/Menus";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-clip bg-white">
      <Header />
      <main className="flex-1 w-full">
        <Hero />
        <Carta />
        <Menus />
        <Ubicacion />
      </main>
      <Analytics />
      <Footer />
    </div>
  );
}
