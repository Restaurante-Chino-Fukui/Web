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
                const headerOffset = 72;
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
        <header className="fixed top-0 left-0 right-0 h-[72px] w-full bg-white text-gray-800 px-5 md:px-12 z-50">
            <div className="w-full h-full max-w-7xl mx-auto flex justify-between items-center gap-5">
                <a
                    href="#top"
                    onClick={(e) => handleLinkClick(e, "#top")}
                    className="shrink-0 text-xl md:text-2xl font-bold tracking-[0.14em] text-red-700 hover:text-red-800 transition-colors"
                >
                    FUKUI
                </a>
                <nav className="min-w-0">
                    <ul className="flex items-center gap-4 sm:gap-6 md:gap-8">
                        {[
                            { href: "#carta", text: "CARTA" },
                            { href: "#menus", text: "MENÚS" },
                            { href: "#ubicacion", text: "RESTAURANTE", desktopText: "EL RESTAURANTE" }
                        ].map(({ href, text, desktopText }) => (
                            <li key={href}>
                                <a
                                    href={href}
                                    className="whitespace-nowrap text-[11px] sm:text-xs md:text-sm font-medium tracking-wide text-gray-600 hover:text-red-700 transition-colors"
                                    onClick={(e) => handleLinkClick(e, href)}
                                >
                                    <span className={desktopText ? "md:hidden" : undefined}>{text}</span>
                                    {desktopText && <span className="hidden md:inline">{desktopText}</span>}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
