'use client'
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
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

const HEADER_HEIGHT = 72;
const DEFAULT_FILTER_HEIGHT = 92;

const ordenCategorias = ["Especiales", "Ensaladas", "Entrantes", "Sopas", "Arroces", "Tallarines", "Huevos", "Verduras", "Cerdos", "Terneras", "Mariscos", "Pollos", "Patos", "Sushis", "Dim Sums"];

const gruposCategorias = [
    { nombre: "Especiales", categorias: ["Especiales"] },
    { nombre: "Para empezar", categorias: ["Ensaladas", "Entrantes", "Sopas"] },
    { nombre: "Arroces y tallarines", categorias: ["Arroces", "Tallarines"] },
    { nombre: "Huevos y verduras", categorias: ["Huevos", "Verduras"] },
    { nombre: "Carnes y mariscos", categorias: ["Cerdos", "Terneras", "Mariscos", "Pollos", "Patos"] },
    { nombre: "Sushi y dim sum", categorias: ["Sushis", "Dim Sums"] },
];

const platosEspeciales = ['29', '49B', '94B', '428', '409'];

export default function Carta() {
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categoriaActiva, setCategoriaActiva] = useState("Especiales");
    const [filterHeight, setFilterHeight] = useState(DEFAULT_FILTER_HEIGHT);

    const cartaRef = useRef<HTMLElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const gruposDisponibles = gruposCategorias
        .map((grupo) => ({
            ...grupo,
            categorias: grupo.categorias.filter((categoria) => categorias.includes(categoria)),
        }))
        .filter((grupo) => grupo.categorias.length > 0);

    const grupoActivo = gruposDisponibles.find((grupo) => grupo.categorias.includes(categoriaActiva)) ?? gruposDisponibles[0];

    useEffect(() => {
        const filter = filterRef.current;
        if (!filter) return;

        const updateFilterHeight = () => setFilterHeight(filter.getBoundingClientRect().height);
        updateFilterHeight();

        const observer = new ResizeObserver(updateFilterHeight);
        observer.observe(filter);

        return () => observer.disconnect();
    }, [grupoActivo?.nombre]);

    useEffect(() => {
        const CACHE_KEY = 'fukui_carta_data';
        const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

        const obtenerPlatos = async () => {
            try {
                setLoading(true);

                // Attempt to load from cache first
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const parsedCache = JSON.parse(cachedData);
                    if (Date.now() - parsedCache.timestamp < CACHE_EXPIRY) {
                        const cachedPlatos = parsedCache.platos;
                        setPlatos(cachedPlatos);
                        const categoriasUnicas = [...Array.from(new Set(cachedPlatos.map((p: Plato) => p.categoria))) as string[]];
                        setCategorias([...ordenCategorias.filter(cat => categoriasUnicas.includes(cat))]);
                        setLoading(false);
                        return;
                    }
                }

                const platosCollection = collection(db, 'platos');
                const platosSnapshot = await getDocs(platosCollection);
                const platosLista = await Promise.all(platosSnapshot.docs.map(async doc => {
                    const datoPlato = doc.data() as Omit<Plato, 'id' | 'imagen'>;
                    const platosResultantes = [];

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

                // Update cache
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    timestamp: Date.now(),
                    platos: platosListaAplanada
                }));

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
        if (categorias.length > 0 && !categorias.includes(categoriaActiva)) {
            setCategoriaActiva(categorias[0]);
        }
    }, [categorias, categoriaActiva]);

    useEffect(() => {
        if (categorias.length === 0) return;

        let frameId: number | null = null;

        const updateActiveCategory = () => {
            frameId = null;
            const activationLine = Math.max(
                HEADER_HEIGHT + filterHeight + 24,
                window.innerHeight * 0.45
            );

            const sections = Array.from(
                document.querySelectorAll<HTMLElement>('[id^="categoria-"]')
            );

            let activeCategory = sections[0]?.id.replace('categoria-', '') ?? categorias[0];

            for (const section of sections) {
                const top = section.getBoundingClientRect().top;
                if (top <= activationLine) {
                    activeCategory = section.id.replace('categoria-', '');
                } else {
                    break;
                }
            }

            setCategoriaActiva(prev => prev === activeCategory ? prev : activeCategory);
        };

        const requestUpdate = () => {
            if (frameId !== null) return;
            frameId = window.requestAnimationFrame(updateActiveCategory);
        };

        requestUpdate();
        window.addEventListener('scroll', requestUpdate, { passive: true });
        window.addEventListener('resize', requestUpdate);
        const intervalId = window.setInterval(requestUpdate, 250);

        return () => {
            if (frameId !== null) window.cancelAnimationFrame(frameId);
            window.clearInterval(intervalId);
            window.removeEventListener('scroll', requestUpdate);
            window.removeEventListener('resize', requestUpdate);
        };
    }, [categorias, filterHeight]);

    if (loading) return <div>Cargando menú...</div>;
    if (error) return <div>{error}</div>;

    const handleCategoryClick = (categoria: string) => {
        setCategoriaActiva(categoria);

        const categoryElement = document.getElementById(`categoria-${categoria}`);
        if (categoryElement) {
            const elementPosition = categoryElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - HEADER_HEIGHT - filterHeight - 16;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleGroupClick = (categoriasGrupo: string[]) => {
        const primeraCategoria = categoriasGrupo[0];
        if (primeraCategoria) handleCategoryClick(primeraCategoria);
    };

    return (
        <section id="carta" className="w-full min-h-screen bg-white" ref={cartaRef}>
            <div className="container mx-auto px-4 w-full max-w-7xl">
                <div className="text-center mt-24 mb-12">
                    <span className="text-red-700 font-medium tracking-[0.2em] text-sm uppercase">Nuestra Cocina</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-900 tracking-tight">La Carta</h2>
                </div>
            </div>

            <div ref={filterRef} className="sticky top-[72px] z-40 w-full select-none bg-white shadow-[0_10px_22px_rgba(20,20,20,0.03)]">
                <div className="mx-auto max-w-7xl px-4 py-2.5">
                    <div className="relative">
                        <div className="flex items-center justify-start gap-6 overflow-x-auto pr-8 md:justify-center">
                            {gruposDisponibles.map((grupo) => {
                                const activo = grupo.nombre === grupoActivo?.nombre;

                                return (
                                    <button
                                        key={grupo.nombre}
                                        onClick={() => handleGroupClick(grupo.categorias)}
                                        className={`select-none whitespace-nowrap px-0.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300
                                            ${activo
                                                ? 'text-red-700'
                                                : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        {grupo.nombre}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-white/0" />
                    </div>

                    {grupoActivo && grupoActivo.categorias.length > 1 && (
                        <div className="relative mt-2">
                            <div className="flex items-center justify-start gap-1.5 overflow-x-auto pr-8 md:justify-center">
                                {grupoActivo.categorias.map((categoria) => (
                                    <button
                                        key={categoria}
                                        onClick={() => handleCategoryClick(categoria)}
                                        className={`select-none whitespace-nowrap rounded px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] transition-all duration-300
                                            ${categoria === categoriaActiva
                                                ? 'bg-stone-900 text-white shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        {categoria}
                                    </button>
                                ))}
                            </div>
                            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-white/0" />
                        </div>
                    )}
                </div>
            </div>

            <div className="container mx-auto px-4 w-full max-w-7xl">
                <div ref={contentRef} className="mt-10 pb-20">
                    {categorias
                        .filter(cat => cat !== "Todos")
                        .map((categoria) => (
                            <div
                                key={categoria}
                                id={`categoria-${categoria}`}
                                className="mb-20"
                                style={{ scrollMarginTop: HEADER_HEIGHT + filterHeight + 16 }}
                            >
                                <h3 className="text-3xl font-light mb-8 text-gray-900 tracking-tight border-b border-gray-100 pb-3">{categoria}</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                                    {platos
                                        .filter(plato => plato.categoria === categoria)
                                        .map((plato) => (
                                            <div key={plato.codigo} className="group flex flex-col items-center text-center">
                                                <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-full shadow-sm group-hover:shadow-xl transition-all duration-500 border-4 border-white ring-1 ring-gray-100 group-hover:ring-red-100 group-hover:border-red-50">
                                                    <Image
                                                        src={plato.imagen}
                                                        alt={plato.nombre}
                                                        fill
                                                        draggable={false}
                                                        sizes="(min-width: 1280px) 224px, (min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                                                        className="select-none object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                    />
                                                </div>
                                                <h4 className="text-base font-medium text-gray-900 tracking-tight leading-snug px-2">
                                                    <span className="text-red-700 font-semibold mr-1">{plato.codigo}.</span>
                                                    {plato.nombre}
                                                </h4>
                                                <p className="mt-2 text-gray-500 font-light text-lg">
                                                    {plato.precio.toFixed(2)} <span className="text-sm">€</span>
                                                </p>
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
