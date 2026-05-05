"use client"

export default function Header() {
    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();

        if (href === "#top") {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                const headerOffset = 80;
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
        <header className="fixed top-0 left-0 right-0 w-full bg-white text-gray-800 py-5 px-6 md:px-12 z-50">
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
                <a
                    href="#top"
                    onClick={(e) => handleLinkClick(e, "#top")}
                    className="text-2xl font-bold tracking-widest text-red-700 hover:text-red-800 transition-colors"
                >
                    FUKUI
                </a>
                <nav>
                    <ul className="flex space-x-8">
                        {[
                            { href: "#carta", text: "CARTA" },
                            { href: "#menus", text: "MENÚS" },
                            { href: "#ubicacion", text: "EL RESTAURANTE" }
                        ].map(({ href, text }) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    className="text-sm font-medium tracking-wide text-gray-600 hover:text-red-700 transition-colors"
                                    onClick={(e) => handleLinkClick(e, href)}
                                >
                                    {text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
