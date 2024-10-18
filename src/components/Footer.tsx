import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-indigo-900 text-white py-12">
            <div className="container mx-auto text-center">
                <div className="flex justify-center space-x-6 mb-6">
                    <a href="#" className="hover:text-red-300 transition-colors"><Facebook /></a>
                    <a href="#" className="hover:text-red-300 transition-colors"><Instagram /></a>
                    <a href="#" className="hover:text-red-300 transition-colors"><Twitter /></a>
                </div>
                <p className="mb-4">&copy; 2023 FUKUI. Todos los derechos reservados.</p>
                <p>Calle Principal 123, Ciudad, País | Tel: +123 456 789 | Email: info@fukui.com</p>
            </div>
        </footer>
    );
}
