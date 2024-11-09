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
                                    className="text-base md:text-lg lg:text-xl hover:text-indigo-600 transition-colors"
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
