"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useFirebase } from './useFirebase';
import { ref, getDownloadURL } from "firebase/storage";

export default function Hero() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const firebase = useFirebase();

    useEffect(() => {
        if (typeof window !== 'undefined' && firebase) {
            const fetchImageUrl = async () => {
                const imageRef = ref(firebase.storage, 'hero-bg.jpg');
                try {
                    const url = await getDownloadURL(imageRef);
                    setImageUrl(url);
                } catch (error) {
                    console.error("Error al obtener la URL de la imagen:", error);
                }
            };

            fetchImageUrl();
        }
    }, [firebase]);

    return (
        <section className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 72px)', marginTop: '72px' }}>
            {imageUrl && (
                <div className="absolute inset-0">
                    <Image
                        src={imageUrl}
                        alt="Imagen de fondo de FUKUI"
                        fill
                        draggable={false}
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        quality={85}
                        priority
                    />
                </div>
            )}
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white z-10 px-4 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Tradición y Sabor</h1>
                    <p className="text-xl md:text-2xl mb-10 text-gray-200 font-light">Descubre la auténtica gastronomía china en un ambiente elegante y acogedor.</p>
                    <a
                        href="tel:+34962684004"
                        className="inline-block bg-red-700 hover:bg-red-800 text-white font-medium py-3 px-10 rounded-sm transition-all duration-300 text-lg shadow-[0_4px_14px_rgba(185,28,28,0.4)] hover:shadow-[0_6px_20px_rgba(185,28,28,0.6)] hover:-translate-y-0.5"
                    >
                        Haz tu Reserva
                    </a>
                </div>
            </div>
        </section>
    );
}
