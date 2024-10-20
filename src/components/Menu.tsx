'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useFirebase } from '../hooks/useFirebase';
import { db, storage } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const firebase = useFirebase();

    useEffect(() => {
        const obtenerPlatos = async () => {
            try {
                const platosCollection = collection(db, 'platos');
                const platosSnapshot = await getDocs(platosCollection);
                const platosPromises = platosSnapshot.docs.map(async (doc) => {
                    const data = doc.data() as Omit<Plato, 'id' | 'imagen'>;
                    try {
                        const imageRef = ref(storage, `platos/${doc.id}.jpg`);
                        const imageUrl = await getDownloadURL(imageRef);
                        return { ...data, id: doc.id, imagen: imageUrl };
                    } catch (error) {
                        console.error(`Error al obtener la imagen para el plato ${doc.id}:`, error);
                        return { ...data, id: doc.id, imagen: '' };
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

    return (
        <section id="menu" className="py-24 bg-gray-100">
            <div className="container mx-auto px-4">
                <h2 className="text-5xl font-bold text-center mb-16 text-black">Nuestro Menú</h2>

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {platosFiltrados.map((plato) => (
                        <div key={plato.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="relative h-48">
                                <Image
                                    src={plato.imagen}
                                    alt={plato.nombre}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="p-4">
                                <h4 className="text-lg font-semibold mb-2 text-black">
                                    {plato.nombre}
                                </h4>
                                <p className="text-indigo-600 font-bold">{plato.precio.toFixed(2)} €</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
