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
        codigo: "13",
        nombre: "SOPA DE LA CASA",
        precio: 4.80,
        categoria: "Sopas"
    },
    {
        codigo: "14",
        nombre: "SOPA DE ALETAS DE TIBURÓN",
        precio: 3.95,
        categoria: "Sopas"
    },
    {
        codigo: "16",
        nombre: "SOPA AGRIPICANTE",
        precio: 3.95,
        categoria: "Sopas"
    },
    {
        codigo: "17",
        nombre: "SOPA DE FIDEOS CON POLLO",
        precio: 3.95,
        categoria: "Sopas"
    },
    {
        codigo: "18",
        nombre: "SOPA DE MAÍZ CON CANGREJO",
        precio: 3.95,
        categoria: "Sopas"
    },
    {
        codigo: "19",
        nombre: "SOPA DE HUEVOS CON VERDURAS",
        precio: 3.95,
        categoria: "Sopas"
    },
    {
        codigo: "21",
        nombre: "SOPA DE WANTUN",
        precio: 4.85,
        categoria: "Sopas"
    },

    // Arroces
    {
        codigo: "22",
        nombre: "ARROZ CON GAMBAS",
        precio: 5.80,
        categoria: "Arroces"
    },
    {
        codigo: "23",
        nombre: "ARROZ TRES DELICIAS",
        precio: 4.95,
        categoria: "Arroces"
    },
    {
        codigo: "24",
        nombre: "ARROZ CON HUEVO",
        precio: 4.95,
        categoria: "Arroces"
    },
    {
        codigo: "25",
        nombre: "ARROZ \"KAIFAI\" DE MARISCO",
        precio: 7.95,
        categoria: "Arroces"
    },
    {
        codigo: "25B",
        nombre: "ARROZ \"KAIFAI\" DE POLLO",
        precio: 7.50,
        categoria: "Arroces"
    },
    {
        codigo: "27",
        nombre: "ARROZ CON TERNERA",
        precio: 5.80,
        categoria: "Arroces"
    },
    {
        codigo: "28",
        nombre: "ARROZ CON CURRY",
        precio: 5.80,
        categoria: "Arroces"
    },
    {
        codigo: "29",
        nombre: "ARROZ FUKU",
        precio: 6.20,
        categoria: "Arroces"
    },
    {
        codigo: "29B",
        nombre: "ARROZ CON BROTES DE SOJA",
        precio: 5.80,
        categoria: "Arroces"
    },
    {
        codigo: "30",
        nombre: "ARROZ BLANCO",
        precio: 3.80,
        categoria: "Arroces"
    },

    // Tallarines
    {
        codigo: "31",
        nombre: "TALLARINES CON GAMBAS",
        precio: 6.30,
        categoria: "Tallarines"
    },
    {
        codigo: "32",
        nombre: "TALLARINES CON TRES DELICIAS",
        precio: 5.80,
        categoria: "Tallarines"
    },
    {
        codigo: "33",
        nombre: "TALLARINES CON TERNERA",
        precio: 5.80,
        categoria: "Tallarines"
    },
    {
        codigo: "34",
        nombre: "FIDEOS DE ARROZ CON TRES DELICIAS",
        precio: 6.20,
        categoria: "Tallarines"
    },
    {
        codigo: "34B",
        nombre: "FIDEOS DE ARROZ CON GAMBAS",
        precio: 6.80,
        categoria: "Tallarines"
    },
    {
        codigo: "35",
        nombre: "TALLARINES CHINOS SALTEADOS",
        precio: 6.50,
        categoria: "Tallarines"
    },
    {
        codigo: "414",
        nombre: "FIDEOS DE PATATAS",
        precio: 6.80,
        categoria: "Tallarines"
    },

    // Otros
    {
        codigo: "415",
        nombre: "PASTA DE ARROZ",
        precio: 7.20,
        categoria: "Tallarines"
    },
    {
        codigo: "80",
        nombre: "KU-BAK CON GAMBAS",
        precio: 7.20,
        categoria: "Tallarines"
    },
    {
        codigo: "81",
        nombre: "HORMIGAS EN EL ÁRBOL",
        precio: 6.95,
        categoria: "Tallarines"
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
//insertarPlatos();

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
    const menuRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const HEADER_HEIGHT = 60; // Altura del header en píxeles
    const FILTER_MARGIN = 32; // Margen adicional para el filtro (ajusta según sea necesario)

    // Definimos el orden deseado de las categorías
    const ordenCategorias = ["Ensaladas", "Entrantes", "Sopas", "Arroces", "Tallarines", "Otros"];

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

                // Ordenamos las categorías según el orden definido
                const categoriasOrdenadas = ["Todos", ...ordenCategorias.filter(cat => categoriasUnicas.includes(cat))];
                setCategorias(categoriasOrdenadas);

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
            const scrollToPosition = Math.max(0, originalFilterTop - HEADER_HEIGHT - FILTER_MARGIN);
            window.scrollTo({
                top: scrollToPosition,
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

    const categoriasAMostrar = filtro === "Todos"
        ? categorias.filter(cat => cat !== "Todos")
        : [filtro];

    return (
        <section id="menu" className="py-12 bg-gray-100" ref={menuRef}>
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-8 text-black">Nuestro Menú</h2>

                {isSticky && (
                    <div style={{ height: `${filterHeight + FILTER_MARGIN}px` }} />
                )}

                <div
                    ref={filterRef}
                    className={`${isSticky ? 'fixed left-0 right-0 py-4 z-10' : ''}`}
                    style={{
                        top: isSticky ? `${HEADER_HEIGHT}px` : 'auto',
                        background: 'transparent',
                        boxShadow: 'none'
                    }}
                >
                    <div className="flex justify-center space-x-4 flex-wrap mb-8">
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

                <div ref={contentRef} className={`mt-${FILTER_MARGIN / 4}`}>
                    {categoriasAMostrar.map((categoria) => (
                        <div key={categoria} className="mb-12">
                            <h3 className="text-2xl font-semibold mb-6 text-black">{categoria}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
                                        <div className="p-2">
                                            <h4 className="text-sm font-semibold mb-1 text-black h-10 overflow-hidden">
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
