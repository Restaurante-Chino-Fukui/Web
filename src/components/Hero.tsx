import Image from 'next/image';

export default function Hero() {
    return (
        <section className="relative bg-indigo-800 text-white py-48">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-background.jpg"
                    alt="Plato japonés"
                    layout="fill"
                    objectFit="cover"
                    className="opacity-30"
                />
            </div>
            <div className="container mx-auto text-center relative z-10 px-4">
                <h1 className="text-6xl font-bold mb-6">Bienvenido a FUKUI</h1>
                <p className="text-2xl mb-12">Descubre la auténtica cocina japonesa</p>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full transition-colors text-xl shadow-lg">
                    Reserva ahora
                </button>
            </div>
        </section>
    );
}
