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
        <section className="relative w-full" style={{ height: 'calc(100vh - 60px)' }}>
            {imageUrl && (
                <div className="absolute inset-0">
                    <Image
                        src={imageUrl}
                        alt="Imagen de fondo de FUKUI"
                        fill
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                        }}
                        quality={85}
                        priority
                    />
                </div>
            )}
            <div className="absolute inset-0 bg-black opacity-70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white z-10">
                    <h1 className="text-6xl font-bold mb-6">Bienvenido a FUKUI</h1>
                    <p className="text-2xl mb-12">Descubre la mejor comida china de la zona</p>
                    <a
                        href="tel:+34962684004"
                        className="inline-block bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full transition-colors text-xl shadow-lg"
                    >
                        Llámanos ahora
                    </a>
                </div>
            </div>
        </section>
    );
}
