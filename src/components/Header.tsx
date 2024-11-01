"use client"
import { useState, useEffect } from 'react';

export default function Header() {
    const [activeLink, setActiveLink] = useState<string | null>(null);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px 0px 0px',
            threshold: [0, 1]
        };

        const visibleSections = new Set();
        const sections = ["carta", "menus", "ubicacion"];

        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                if (entry.isIntersecting) {
                    visibleSections.add(sectionId);
                } else {
                    visibleSections.delete(sectionId);
                }
            });

            if (visibleSections.size > 0) {
                // Obtener la primera sección visible
                const activeSection = Array.from(visibleSections)[0];
                setActiveLink(`#${activeSection}`);
            }
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        // Observar todas las secciones
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();

        if (href === "#top") {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            setActiveLink(null);
        } else {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerOffset = 60;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
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
                            { href: "#menus", text: "Menús" },
                            { href: "#ubicacion", text: "Ubicación" }
                        ].map(({ href, text }) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    className={`relative text-base md:text-lg lg:text-xl transition-colors ${activeLink === href ? 'text-indigo-600' : 'hover:text-indigo-600'
                                        }`}
                                    onClick={(e) => handleLinkClick(e, href)}
                                >
                                    {text}
                                    {activeLink === href && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
