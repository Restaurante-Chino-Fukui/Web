'use client'
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Plato {
    id: string;
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
    const [originalFilterTop, setOriginalFilterTop] = useState<number | null>(null);
    const [filterHeight, setFilterHeight] = useState(0);
    const [animatingCategory, setAnimatingCategory] = useState<string | null>(null);

    const filterRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const HEADER_HEIGHT = 60; // Altura del header en píxeles

    // Guardar la posición original del filtro y su altura cuando se carga el componente
    useEffect(() => {
        if (filterRef.current) {
            const rect = filterRef.current.getBoundingClientRect();
            setOriginalFilterTop(rect.top + window.scrollY);
            setFilterHeight(rect.height);
        }
    }, [loading]);

    useEffect(() => {
        const handleScroll = () => {
            if (!filterRef.current || !menuRef.current || !contentRef.current || originalFilterTop === null) return;

            const filterRect = filterRef.current.getBoundingClientRect();
            const contentRect = contentRef.current.getBoundingClientRect();
            const currentScroll = window.scrollY;

            if (currentScroll >= originalFilterTop - HEADER_HEIGHT &&
                contentRect.bottom > filterRect.height + HEADER_HEIGHT) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [originalFilterTop]);

    useEffect(() => {
        const obtenerPlatos = async () => {
            try {
                const platosCollection = collection(db, 'platos');
                const platosSnapshot = await getDocs(platosCollection);
                const platosLista = platosSnapshot.docs.map(doc => ({
                    ...doc.data()
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
        if (contentRef.current && originalFilterTop !== null) {
            window.scrollTo({
                top: Math.max(0, originalFilterTop - HEADER_HEIGHT),
                behavior: 'smooth'
            });
        }
    }, [filtro, originalFilterTop]);

    if (loading) return <div>Cargando menú...</div>;
    if (error) return <div>{error}</div>;

    const platosFiltrados = platos.filter(plato => filtro === "Todos" || plato.categoria === filtro);

    const handleCategoryClick = (categoria: string) => {
        setAnimatingCategory(categoria);
        setTimeout(() => {
            setAnimatingCategory(null);
            setFiltro(categoria);
        }, 300); // Duración de la animación
    };

    return (
        <section id="menu" className="py-24 bg-gray-100" ref={menuRef}>
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-bold text-center mb-16 text-black">Nuestro Menú</h2>

                {isSticky && (
                    <div style={{ height: `${filterHeight}px` }} />
                )}

                <div
                    ref={filterRef}
                    className={`transition-all duration-300 ${isSticky ? 'fixed left-0 right-0 py-4 z-10' : ''
                        }`}
                    style={{
                        top: isSticky ? `${HEADER_HEIGHT}px` : 'auto',
                        paddingLeft: '1rem',
                        paddingRight: '1rem'
                    }}
                >
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center space-x-4 flex-wrap">
                            {categorias.map((categoria) => (
                                <button
                                    key={categoria}
                                    onClick={() => handleCategoryClick(categoria)}
                                    className={`px-4 py-2 rounded-full transition-all duration-300 ${filtro === categoria
                                        ? 'bg-indigo-600 text-white transform scale-105'
                                        : 'bg-white border border-gray-300 text-indigo-600 hover:bg-indigo-100'
                                        } ${animatingCategory === categoria
                                            ? 'animate-pulse'
                                            : ''
                                        }`}
                                >
                                    {categoria}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div ref={contentRef} className="mt-8">
                    {categorias.slice(1).map((categoria) => {
                        const platosEnCategoria = platosFiltrados.filter(plato => plato.categoria === categoria);
                        if (platosEnCategoria.length === 0) return null;

                        return (
                            <div key={categoria} className="mb-16">
                                <h3 className="text-4xl font-bold mb-8 text-black">{categoria}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {platosEnCategoria.map((plato) => (
                                        <div key={plato.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                            <div className="relative h-48">
                                                <Image
                                                    src={plato.imagen}
                                                    alt={plato.nombre}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                                <div className="absolute top-0 left-0 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">
                                                    {plato.id}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="text-lg font-semibold mb-2 text-black">
                                                    {plato.id}. {plato.nombre}
                                                </h4>
                                                <p className="text-indigo-600 font-bold">{plato.precio.toFixed(2)} €</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
