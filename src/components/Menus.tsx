'use client'

import { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface MenuPlato {
    cantidad: number;
    nombre: string;
}

interface Menu {
    id?: string;
    personas: number;
    platos: MenuPlato[];
    precio: number;
}

export default function Menus() {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        obtenerMenus();
    }, []);

    const obtenerMenus = async () => {
        try {
            setLoading(true);
            const menusCollection = collection(db, 'menus');
            const menusSnapshot = await getDocs(menusCollection);
            const menusLista = menusSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Menu[];

            menusLista.sort((a, b) => a.personas - b.personas);

            setMenus(menusLista);
            setLoading(false);
        } catch (err) {
            console.error("Error al obtener los menús:", err);
            setError("Hubo un problema al cargar los menús. Por favor, intenta de nuevo más tarde.");
            setLoading(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen text-lg text-gray-600">Cargando menús...</div>;
    if (error) return <div className="flex items-center justify-center h-screen text-lg text-red-500">{error}</div>;

    const menusSuperiores = menus.filter(menu => menu.personas <= 3);
    const menusInferiores = menus.filter(menu => menu.personas > 3);

    return (
        <section id="menus" className="w-full min-h-screen bg-gray-50 py-24">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="text-red-700 font-medium tracking-[0.2em] text-sm uppercase">Experiencia Fukui</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900 tracking-tight">Menús de Degustación</h2>
                    <div className="w-12 h-[2px] bg-red-700 mx-auto mt-6"></div>
                </div>
                
                <div className="space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {menusSuperiores.map((menu) => (
                            <MenuCard key={menu.id} menu={menu} />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {menusInferiores.map((menu) => (
                            <MenuCard key={menu.id} menu={menu} />
                        ))}
                    </div>
                    <div className="text-center mt-16 p-8 bg-white border border-gray-100 shadow-sm max-w-2xl mx-auto rounded-sm">
                        <p className="text-lg text-gray-600">
                            Para menús de más personas, no dude en
                            <a
                                href="tel:+34962684004"
                                className="text-red-700 hover:text-red-800 font-semibold ml-2 inline-flex items-center transition-colors"
                            >
                                consultarnos
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MenuCard({ menu }: { menu: Menu }) {
    return (
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-white border-b border-gray-100 flex flex-col items-center justify-center py-8">
                <span className="text-gray-400 text-sm tracking-[0.2em] uppercase mb-2">Menú Degustación</span>
                <h3 className="text-2xl font-light text-gray-900 tracking-tight">{menu.personas} Personas</h3>
            </div>
            <div className="p-8">
                <ul className="space-y-4 mb-8">
                    {menu.platos.map((plato, index) => (
                        <li key={index} className="text-gray-600 flex items-center justify-between text-sm md:text-base border-b border-gray-50 pb-2">
                            <span className="font-medium text-gray-800">{plato.cantidad}x</span> 
                            <span className="text-right">{plato.nombre}</span>
                        </li>
                    ))}
                </ul>
                <div className="pt-6 border-t border-gray-100 text-center">
                    <p className="text-3xl font-light text-gray-900">
                        {menu.precio.toFixed(2)}<span className="text-lg text-gray-400 ml-1">€</span>
                    </p>
                </div>
            </div>
        </div>
    );
}