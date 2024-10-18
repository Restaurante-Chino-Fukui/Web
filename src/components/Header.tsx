import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-indigo-900 text-white py-4 px-6 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors">
                    FUKUI
                </Link>
                <nav>
                    <ul className="flex space-x-6">
                        <li><Link href="/menu" className="hover:text-red-300 transition-colors">Menú</Link></li>
                        <li><Link href="/nosotros" className="hover:text-red-300 transition-colors">Nosotros</Link></li>
                        <li><Link href="/contacto" className="hover:text-red-300 transition-colors">Contacto</Link></li>
                    </ul>
                </nav>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors">
                    Pedido
                </button>
            </div>
        </header>
    );
}
