import { Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-indigo-900 text-white py-8 md:py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center space-y-6">
                    <a
                        href="https://www.facebook.com/p/Restaurante-Chino-Fukui-100063811652176/?locale=es_ES"
                        className="hover:text-red-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Facebook size={28} />
                    </a>

                    <p className="text-sm md:text-base opacity-90">
                        © {new Date().getFullYear()} FUKUI. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
