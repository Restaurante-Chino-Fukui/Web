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
        <section id="menus" className="w-full min-h-screen bg-white py-12">
            <div className="container mx-auto px-4 max-w-7xl">
                <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">Menús de gustación</h1>
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                        {menusSuperiores.map((menu) => (
                            <MenuCard key={menu.id} menu={menu} />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {menusInferiores.map((menu) => (
                            <MenuCard key={menu.id} menu={menu} />
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <p className="text-lg text-gray-700">
                            Para menús de más personas,
                            <a
                                href="tel:+34962684004"
                                className="text-red-600 hover:text-red-700 font-semibold ml-1"
                            >
                                consúltenos llamando al 962 68 40 04
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-red-600 text-white px-6 py-4">
                <h3 className="text-xl font-semibold">Menú para {menu.personas} personas</h3>
                <p className="text-lg mt-1">Precio: {menu.precio.toFixed(2)}€</p>
            </div>
            <div className="p-6">
                <ul className="space-y-3">
                    {menu.platos.map((plato, index) => (
                        <li key={index} className="text-gray-700 flex items-center">
                            {plato.cantidad} - {plato.nombre}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}