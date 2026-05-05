import { Facebook } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-stone-900 border-t border-stone-800 text-stone-300 py-16">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left mb-12">
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <span className="text-2xl font-bold tracking-widest text-red-700">FUKUI</span>
                        <p className="font-light text-sm text-stone-400 leading-relaxed max-w-xs">
                            Descubre la auténtica gastronomía china en Puerto de Sagunto. Un lugar donde la tradición y el sabor se unen.
                        </p>
                    </div>
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <h4 className="text-white tracking-widest font-medium uppercase text-sm">Contacto</h4>
                        <div className="space-y-2 text-sm font-light text-stone-400">
                            <p>Av. Mediterráneo, 87</p>
                            <p>46520 Puerto de Sagunto</p>
                            <p className="pt-2 text-stone-300 font-medium">+34 962 684 004</p>
                            <p className="pt-2 text-stone-300 font-medium">+34 961 185 629</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end justify-center space-y-4">
                        <h4 className="text-white tracking-widest font-medium uppercase text-sm">Síguenos</h4>
                        <a
                            href="https://www.facebook.com/p/Restaurante-Chino-Fukui-100063811652176/?locale=es_ES"
                            className="text-stone-400 hover:text-white transition-colors duration-300 p-2 rounded-full border border-stone-700 hover:border-stone-500"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <Facebook size={20} />
                        </a>
                    </div>
                </div>
                <div className="pt-8 border-t border-stone-800 text-center">
                    <p className="text-xs md:text-sm font-light tracking-wide text-stone-500">
                        &copy; {new Date().getFullYear()} Restaurante Chino FUKUI. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
