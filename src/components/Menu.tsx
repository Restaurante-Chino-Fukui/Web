'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { db, storage } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

interface Plato {
    codigo: string;
    nombre: string;
    precio: number;
    imagen: string;
    categoria: string;
}

export default function Menu() {
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [filtro, setFiltro] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const obtenerPlatos = async () => {
            try {
                const platosCollection = collection(db, 'platos');
                const platosSnapshot = await getDocs(platosCollection);
                const platosPromises = platosSnapshot.docs.map(async (doc) => {
                    const data = doc.data() as Omit<Plato, 'imagen'>;
                    try {
                        const imageRef = ref(storage, `platos/${data.codigo}.jpg`);
                        const imageUrl = await getDownloadURL(imageRef);
                        return { ...data, imagen: imageUrl };
                    } catch (error) {
                        console.error(`Error al obtener la imagen para el plato ${data.codigo}:`, error);
                        return { ...data, imagen: '' };
                    }
                });

                const platosConImagenes = await Promise.all(platosPromises);
                setPlatos(platosConImagenes);
                const categoriasUnicas = ["Todos", ...Array.from(new Set(platosConImagenes.map(plato => plato.categoria)))];
                setCategorias(categoriasUnicas);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los platos:', error);
                setError('Error al cargar los platos');
            } finally {
                setLoading(false);
            }
        };

        obtenerPlatos();
    }, []);

    if (loading) return <div>Cargando menú...</div>;
    if (error) return <div>{error}</div>;

    const platosFiltrados = platos.filter(plato => filtro === "Todos" || plato.categoria === filtro);

    const categoriasAMostrar = filtro === "Todos" ? categorias.filter(cat => cat !== "Todos") : [filtro];

    return (
        <section id="menu" className="py-12 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-8 text-black">Nuestro Menú</h2>

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
        </section>
    );
}
