

import { ShoppingBag, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white text-gray-800 py-4 px-6 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                    Fukui
                </Link>
                <nav className="hidden md:block">
                    <ul className="flex space-x-6 items-center">
                        <li><Link href="#menu" className="hover:text-blue-600 transition-colors">Menú</Link></li>
                        <li><Link href="#about" className="hover:text-blue-600 transition-colors">Nosotros</Link></li>
                        <li><Link href="#contact" className="hover:text-blue-600 transition-colors">Contacto</Link></li>
                        <li>
                            <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Pedido
                            </button>
                        </li>
                    </ul>
                </nav>
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Abrir menú"
                >
                    <Menu />
                </button>
            </div>
            {isMenuOpen && (
                <nav className="md:hidden mt-4">
                    <ul className="flex flex-col space-y-4">
                        <li><Link href="#menu" className="block hover:text-blue-600 transition-colors">Menú</Link></li>
                        <li><Link href="#about" className="block hover:text-blue-600 transition-colors">Nosotros</Link></li>
                        <li><Link href="#contact" className="block hover:text-blue-600 transition-colors">Contacto</Link></li>
                        <li>
                            <button className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Pedido
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}
