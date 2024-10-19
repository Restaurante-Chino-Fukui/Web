'use client'
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Plato {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
    categoria: string;
}

export default function Menu() {
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [filtro, setFiltro] = useState("Todos");
    const [isSticky, setIsSticky] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const filterRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const obtenerPlatos = async () => {
            try {
                const platosCollection = collection(db, 'platos');
                const platosSnapshot = await getDocs(platosCollection);
                const platosLista = platosSnapshot.docs.map(doc => ({
                    id: doc.data().id,
                    nombre: doc.data().nombre,
                    precio: doc.data().precio,
                    imagen: doc.data().imagen,
                    categoria: doc.data().categoria
                })) as Plato[];
                setPlatos(platosLista);
                const categoriasUnicas = ["Todos", ...Array.from(new Set(platosLista.map(plato => plato.categoria)))];
                setCategorias(categoriasUnicas);
                setLoading(false);
            } catch (err) {
                console.error("Error al obtener los platos:", err);
                setError("Hubo un problema al cargar el menú. Por favor, intenta de nuevo más tarde.");
                setLoading(false);
            }
        };

        obtenerPlatos();
    }, []);

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

    if (loading) return <div>Cargando menú...</div>;
    if (error) return <div>{error}</div>;

    return (
        <section id="menu" className="py-24 bg-gray-100" ref={menuRef}>
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-bold text-center mb-16 text-black">Nuestro Menú</h2>

                <div ref={filterRef} className={`${isSticky ? 'sticky top-0 bg-gray-100 py-4 z-10' : ''}`}>
                    <div className="flex justify-center mb-12 space-x-4 flex-wrap">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria}
                                onClick={() => setFiltro(categoria)}
                                className={`px-4 py-2 rounded-full ${filtro === categoria
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-indigo-600 hover:bg-indigo-100'
                                    } transition-colors duration-200 mb-2`}
                            >
                                {categoria}
                            </button>
                        ))}
                    </div>
                </div>

                {categorias.slice(1).map((categoria) => (
                    <div key={categoria} className="mb-16">
                        <h3 className="text-4xl font-bold mb-8 text-black">{categoria}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {platos
                                .filter(plato => filtro === "Todos" || plato.categoria === filtro)
                                .filter(plato => plato.categoria === categoria)
                                .map((plato) => (
                                    <div key={plato.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                        <div className="relative h-48">
                                            <Image
                                                src={plato.imagen}
                                                alt={plato.nombre}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="text-lg font-semibold mb-2 text-black">{plato.nombre}</h4>
                                            <p className="text-indigo-600 font-bold">${plato.precio.toFixed(2)}</p>
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
