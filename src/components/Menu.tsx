'use client'
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const menuItems = [
    { name: "Pan Chino", price: "2,00€", image: "/pan-chino.jpg", category: "Entrantes" },
    { name: "Ensalada China", price: "3,90€", image: "/ensalada-china.jpg", category: "Entrantes" },
    { name: "Rollo De Primavera", price: "2,00€", image: "/rollo-primavera.jpg", category: "Entrantes" },
    { name: "Rollo Con Ensalada", price: "3,90€", image: "/rollo-ensalada.jpg", category: "Entrantes" },
    { name: "Ramen Tonkotsu", price: "14€", image: "/ramen.jpg", category: "Fideos" },
    { name: "Tempura Mixta", price: "12€", image: "/tempura.jpg", category: "Frituras" },
    { name: "Sushi Variado", price: "18€", image: "/sushi.jpg", category: "Sushi" },
    { name: "Gyoza de Cerdo", price: "8€", image: "/gyoza.jpg", category: "Entrantes" },
    { name: "Pollo Teriyaki", price: "15€", image: "/teriyaki.jpg", category: "Pollo" },
    { name: "Arroz Frito", price: "10€", image: "/fried-rice.jpg", category: "Arroz" },
    { name: "Salmón a la Parrilla", price: "16€", image: "/grilled-salmon.jpg", category: "Pescado" },
    { name: "Udon con Verduras", price: "13€", image: "/udon.jpg", category: "Fideos" },
];

const categories = ["Todos", ...Array.from(new Set(menuItems.map(item => item.category)))];

export default function Menu() {
    const [filter, setFilter] = useState("Todos");
    const [isSticky, setIsSticky] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (filterRef.current && menuRef.current) {
                const filterTop = filterRef.current.getBoundingClientRect().top;
                const menuBottom = menuRef.current.getBoundingClientRect().bottom;
                setIsSticky(filterTop <= 0 && menuBottom > window.innerHeight);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [filterRef, menuRef]);

    return (
        <section id="menu" className="py-24 bg-gray-100" ref={menuRef}>
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-bold text-center mb-16 text-black">Nuestro Menú</h2>

                <div ref={filterRef} className={`${isSticky ? 'sticky top-0 bg-gray-100 py-4 z-10' : ''}`}>
                    <div className="flex justify-center mb-12 space-x-4 flex-wrap">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={`px-4 py-2 rounded-full ${filter === category
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-indigo-600 hover:bg-indigo-100'
                                    } transition-colors duration-200 mb-2`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {categories.slice(1).map((category) => (
                    <div key={category} className="mb-16">
                        <h3 className="text-4xl font-bold mb-8 text-black">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {menuItems
                                .filter(item => filter === "Todos" || item.category === filter)
                                .filter(item => item.category === category)
                                .map((item, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                        <div className="relative h-48">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="text-lg font-semibold mb-2 text-black">{item.name}</h4>
                                            <p className="text-indigo-600 font-bold">{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
