'use client'
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { db, storage } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

interface Plato {
    codigo: string;
    nombre: string;
    precio: number;
    imagen: string;
    categoria: string;
}

export default function Carta() {
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [isSticky, setIsSticky] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [originalFilterTop, setOriginalFilterTop] = useState<number | null>(null);
    const [filterHeight, setFilterHeight] = useState(0);
    const [animatingCategory, setAnimatingCategory] = useState<string | null>(null);
    const [categoriaActiva, setCategoriaActiva] = useState("Especiales");

    const filterRef = useRef<HTMLDivElement>(null), cartaRef = useRef<HTMLElement>(null), contentRef = useRef<HTMLDivElement>(null);

    const HEADER_HEIGHT = 60, FILTER_MARGIN = 32;

    const ordenCategorias = ["Especiales", "Ensaladas", "Entrantes", "Sopas", "Arroces", "Tallarines", "Huevos", "Verduras", "Cerdos", "Terneras", "Mariscos", "Pollos", "Patos", "Sushis", "Dim Sums"];

    const categoriasFiltro = [
        "Especiales",
        "Ensaladas",
        "Entrantes",
        "Sopas",
        "Arroces",
        "Tallarines",
        "Verduras",
        "Cerdos",
        "Terneras",
        "Mariscos",
        "Pollos",
        "Patos",
        "Sushis",
        "Dim Sums"
    ];

    const platosEspeciales = ['29', '49B', '94B', '428', '409'];

    useEffect(() => {
        if (filterRef.current) {
            const rect = filterRef.current.getBoundingClientRect();
            setOriginalFilterTop(rect.top + window.scrollY);
            setFilterHeight(rect.height);
        }
    }, [loading]);

    useEffect(() => {
        const handleScroll = () => {
            if (!filterRef.current || !cartaRef.current || !contentRef.current || originalFilterTop === null) return;

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
                const platosLista = await Promise.all(platosSnapshot.docs.map(async doc => {
                    const datoPlato = doc.data() as Omit<Plato, 'id' | 'imagen'>;
                    let platosResultantes = [];

                    // Pluralizar categorías si es necesario
                    const categoriasPlural = ["Verdura", "Ternera", "Cerdo", "Marisco", "Pollo"];
                    if (categoriasPlural.includes(datoPlato.categoria)) {
                        datoPlato.categoria = datoPlato.categoria + 's';
                    }

                    try {
                        let imagenRef = ref(storage, `platos/${datoPlato.codigo}.jpg`);
                        let imagenURL;
                        try {
                            imagenURL = await getDownloadURL(imagenRef);
                        } catch {
                            imagenRef = ref(storage, `platos/${datoPlato.codigo}.png`);
                            imagenURL = await getDownloadURL(imagenRef);
                        }

                        // Crear el plato base
                        const platoBase = {
                            id: doc.id,
                            ...datoPlato,
                            imagen: imagenURL
                        };

                        // Añadir el plato en su categoría original
                        platosResultantes.push(platoBase);

                        // Si es un plato especial, añadirlo también en la categoría Especiales
                        if (platosEspeciales.includes(datoPlato.codigo)) {
                            platosResultantes.push({
                                ...platoBase,
                                id: doc.id + '_especial',
                                categoria: 'Especiales'
                            });
                        }

                        return platosResultantes;

                    } catch (imgError) {
                        console.error(`Error al cargar la imagen para ${datoPlato.codigo}:`, imgError);
                        const platoSinImagen = {
                            id: doc.id,
                            ...datoPlato,
                            imagen: ''
                        };
                        platosResultantes.push(platoSinImagen);
                        if (platosEspeciales.includes(datoPlato.codigo)) {
                            platosResultantes.push({
                                ...platoSinImagen,
                                id: doc.id + '_especial',
                                categoria: 'Especiales'
                            });
                        }
                        return platosResultantes;
                    }
                }));

                // Aplanar el array de arrays resultante
                const platosListaAplanada = platosLista.flat();

                // Ordenar platos por categoría y luego por código
                platosListaAplanada.sort((a, b) => {
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

                setPlatos(platosListaAplanada);
                const categoriasUnicas = [...Array.from(new Set(platosListaAplanada.map(plato => plato.categoria)))];

                // Ordenamos las categorías según el orden definido
                const categoriasOrdenadas = [...ordenCategorias.filter(cat => categoriasUnicas.includes(cat))];
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
    }, [originalFilterTop]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px 0px 0px',
            threshold: 0.3
        };

        let currentlyVisible: string[] = [];

        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                const categoria = entry.target.id.replace('categoria-', '');

                if (entry.isIntersecting) {
                    if (!currentlyVisible.includes(categoria)) {
                        currentlyVisible.push(categoria);
                    }
                } else {
                    currentlyVisible = currentlyVisible.filter(cat => cat !== categoria);
                }
            });

            if (currentlyVisible.length > 0) {
                // Usar el primer elemento visible según el orden definido
                const primeraCategoriaOrdenada = ordenCategorias.find(cat =>
                    currentlyVisible.includes(cat)
                );
                if (primeraCategoriaOrdenada) {
                    setCategoriaActiva(primeraCategoriaOrdenada);
                }
            }
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        categorias.forEach(categoria => {
            const element = document.getElementById(`categoria-${categoria}`);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [categorias, ordenCategorias]);

    if (loading) return <div>Cargando menú...</div>;
    if (error) return <div>{error}</div>;

    const handleCategoryClick = (categoria: string) => {
        setAnimatingCategory(categoria);
        setCategoriaActiva(categoria);

        const categoryElement = document.getElementById(`categoria-${categoria}`);
        if (categoryElement) {
            const headerOffset = 76;
            const elementPosition = categoryElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        setTimeout(() => {
            setAnimatingCategory(null);
        }, 300);
    };

    return (
        <section id="carta" className="w-full min-h-screen bg-gray-100" ref={cartaRef}>
            <div className="container mx-auto px-4 w-full">
                <h2 className="text-4xl font-bold text-center mt-12 mb-8 text-black">Nuestra Carta</h2>

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

                    <div className="flex sm:justify-center justify-start overflow-x-auto pb-2 px-4 mb-8 space-x-4 hide-scrollbar">
                        {categoriasFiltro.map((categoria) => (
                            <button
                                key={categoria}
                                onClick={() => handleCategoryClick(categoria)}
                                className={`px-4 py-2 rounded-full text-[16px] whitespace-nowrap text-sm transition-all duration-300 
                                    ${categoria === categoriaActiva
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
                    {categorias
                        .filter(cat => cat !== "Todos")
                        .map((categoria) => (
                            <div key={categoria} id={`categoria-${categoria}`} className="mb-12">
                                <h3 className="text-3xl font-semibold mb-6 text-black">{categoria}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {platos
                                        .filter(plato => plato.categoria === categoria)
                                        .map((plato) => (
                                            <div key={plato.codigo} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                                                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                                                    <Image
                                                        src={plato.imagen}
                                                        alt={plato.nombre}
                                                        layout="fill"
                                                        objectFit="cover"
                                                        className="absolute top-0 left-0 w-full h-full"
                                                    />
                                                </div>
                                                <div className="p-4 flex flex-col flex-grow">
                                                    <h4 className="text-sm font-semibold text-black mb-2 text-[16px]">
                                                        {plato.codigo}. {plato.nombre}
                                                    </h4>
                                                    <div className="mt-auto">
                                                        <p className="text-indigo-600 font-bold text-sm text-center text-[16px]">
                                                            {plato.precio.toFixed(2)} €
                                                        </p>
                                                    </div>
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
