// import { ShoppingBag } from "lucide-react"
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-white text-gray-800 py-4 px-6 shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                    FUKUI
                </Link>
                <nav>
                    <ul className="flex space-x-6">
                        <li><Link href="#menu" className="hover:text-indigo-600 transition-colors">Menú</Link></li>
                        <li><Link href="#about" className="hover:text-indigo-600 transition-colors">Nosotros</Link></li>
                        <li><Link href="#contact" className="hover:text-indigo-600 transition-colors">Contacto</Link></li>
                    </ul>
                </nav>
                {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Pedido
                </button> */}
            </div>
        </header>
    );
}
