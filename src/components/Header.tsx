"use client"
// import { ShoppingBag } from "lucide-react"
import { useState } from 'react';

export default function Header() {
    const [activeLink, setActiveLink] = useState<string | null>(null);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setActiveLink(href);

        if (href === "#top") {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }

        setTimeout(() => setActiveLink(null), 300);
    };

    return (
        <header className="fixed top-0 left-0 right-0 w-full bg-white text-gray-800 py-4 px-6 shadow-md z-50">
            <div className="w-full max-w-[2000px] mx-auto flex justify-between items-center">
                <a
                    href="#top"
                    onClick={(e) => handleLinkClick(e, "#top")}
                    className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                    FUKUI
                </a>
                <nav>
                    <ul className="flex space-x-6">
                        {[
                            { href: "#carta", text: "Carta" },
                            { href: "#about", text: "Nosotros" },
                            { href: "#ubicacion", text: "Ubicación" }
                        ].map(({ href, text }) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    className={`relative hover:text-indigo-600 transition-colors ${activeLink === href ? 'text-indigo-600' : ''
                                        }`}
                                    onClick={(e) => handleLinkClick(e, href)}
                                >
                                    {text}
                                    {activeLink === href && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 animate-expand-line"></span>
                                    )}
                                </a>
                            </li>
                        ))}
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
