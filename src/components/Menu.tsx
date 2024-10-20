'use client'
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { db, storage } from '../config/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

interface Plato {
    codigo: string;
    nombre: string;
    precio: number;
    imagen: string;
    categoria: string;
}
const platosParaInsertar = [
    {
        codigo: "2",
        nombre: "ENSALADA CHINA",
        precio: 4.50,
        categoria: "Ensaladas"
    },
    {
        codigo: "3",
        nombre: "ENSALADA DE BROTES DE SOJA",
        precio: 4.95,
        categoria: "Ensaladas"
    },
    {
        codigo: "3B",
        nombre: "ENSALADA BROTES DE SOJA CON ALGAS",
        precio: 5.95,
        categoria: "Ensaladas"
    },
    {
        codigo: "4",
        nombre: "ENSALADA DE GAMBAS",
        precio: 5.95,
        categoria: "Ensaladas"
    },
    {
        codigo: "5",
        nombre: "ENSALADA DE MARISCOS",
        precio: 5.95,
        categoria: "Ensaladas"
    },
    {
        codigo: "1C",
        nombre: "ENSALADA WAKAME",
        precio: 5.95,
        categoria: "Ensaladas"
    },
    {
        codigo: "7",
        nombre: "ENSALADA CHINA AGRIDULCE",
        precio: 4.95,
        categoria: "Ensaladas"
    }
];

// Función para insertar los platos en la base de datos
async function insertarPlatos() {
    for (const plato of platosParaInsertar) {
        try {
            await addDoc(collection(db, "platos"), plato);
            console.log(`Plato ${plato.nombre} insertado correctamente`);
        } catch (error) {
            console.error(`Error al insertar el plato ${plato.nombre}:`, error);
        }
    }
}

// Llamar a la función para insertar los platos
// insertarPlatos();

export default function Menu() {
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [filtro, setFiltro] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSticky, setIsSticky] = useState(false);
    const [originalFilterTop, setOriginalFilterTop] = useState<number | null>(null);
    const [filterHeight, setFilterHeight] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const filterRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const HEADER_HEIGHT = 60; // Altura del header en píxeles

    useEffect(() => {
        const obtenerPlatos = async () => {
            try {
                setLoading(true);
                const platosCollection = collection(db, 'platos');
                const platosSnapshot = await getDocs(platosCollection);
                let platosLista = await Promise.all(platosSnapshot.docs.map(async doc => {
                    const datoPlato = doc.data() as Omit<Plato, 'id' | 'imagen'>;
                    try {
                        const imagenRef = ref(storage, `platos/${datoPlato.codigo}.jpg`);
                        const imagenURL = await getDownloadURL(imagenRef);
                        return {
                            id: doc.id,
                            ...datoPlato,
                            imagen: imagenURL
                        };
                    } catch (imgError) {
                        console.error(`Error al cargar la imagen para ${datoPlato.codigo}:`, imgError);
                        return {
                            id: doc.id,
                            ...datoPlato,
                            imagen: '' // O una URL de imagen por defecto
                        };
                    }
                }));

                // Ordenar platos por categoría y luego por código
                platosLista.sort((a, b) => {
                    if (a.categoria !== b.categoria) {
                        return a.categoria.localeCompare(b.categoria);
                    }
                    // Extraer números del código para comparación numérica
                    const numA = parseInt(a.codigo.replace(/\D/g, ''));
                    const numB = parseInt(b.codigo.replace(/\D/g, ''));
                    if (numA !== numB) {
                        return numA - numB;
                    }
                    // Si los números son iguales, ordenar alfabéticamente por el código completo
                    return a.codigo.localeCompare(b.codigo);
                });

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
        if (filterRef.current && originalFilterTop === null) {
            setOriginalFilterTop(filterRef.current.getBoundingClientRect().top + window.scrollY);
        }

        const handleScroll = () => {
            if (!filterRef.current || !menuRef.current || originalFilterTop === null) return;

            const menuRect = menuRef.current.getBoundingClientRect();
            const currentScroll = window.scrollY;

            if (currentScroll >= originalFilterTop - HEADER_HEIGHT && currentScroll + window.innerHeight < menuRect.bottom) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [originalFilterTop]);

    if (loading) return <div>Cargando menú...</div>;
    if (error) return <div>{error}</div>;

    const platosFiltrados = platos.filter(plato => filtro === "Todos" || plato.categoria === filtro);

    const categoriasAMostrar = filtro === "Todos" ? categorias.filter(cat => cat !== "Todos") : [filtro];

    return (
        <section id="menu" className="py-12 bg-gray-100" ref={menuRef}>
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-8 text-black">Nuestro Menú</h2>

                {isSticky && (
                    <div style={{ height: `${filterRef.current?.offsetHeight}px` }} />
                )}

                <div
                    ref={filterRef}
                    className={`${isSticky ? 'fixed left-0 right-0 py-4 z-10' : ''}`}
                    style={{
                        top: isSticky ? `${HEADER_HEIGHT}px` : 'auto',
                        background: isSticky ? 'white' : 'transparent',
                        boxShadow: isSticky ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                    }}
                >
                    <div className="flex justify-center space-x-4 flex-wrap mb-8">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria}
                                onClick={() => setFiltro(categoria)}
                                className={`px-4 py-2 rounded-full transition-all duration-300 ${filtro === categoria
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white border border-gray-300 text-indigo-600 hover:bg-indigo-100'
                                    }`}
                            >
                                {categoria}
                            </button>
                        ))}
                    </div>
                </div>

                <div ref={contentRef}>
                    {categoriasAMostrar.map((categoria) => (
                        <div key={categoria} className="mb-12">
                            <h3 className="text-2xl font-semibold mb-6 text-black">{categoria}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {platosFiltrados.filter(plato => plato.categoria === categoria).map((plato) => (
                                    <div key={plato.codigo} className="bg-white rounded-lg shadow-md overflow-hidden">
                                        <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                                            <Image
                                                src={plato.imagen}
                                                alt={plato.nombre}
                                                layout="fill"
                                                objectFit="cover"
                                                className="absolute top-0 left-0 w-full h-full"
                                            />
                                        </div>
                                        <div className="p-3">
                                            <h4 className="text-sm font-semibold mb-1 text-black truncate">
                                                {plato.codigo}. {plato.nombre}
                                            </h4>
                                            <p className="text-indigo-600 font-bold text-sm">{plato.precio.toFixed(2)} €</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
