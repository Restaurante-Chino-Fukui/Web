'use client'
export default function Ubicacion() {
    const handleOpenDirections = () => {
        window.open('https://maps.app.goo.gl/L4saxCHNuWPVudSR9', '_blank');
    };

    return (
        <section id="ubicacion" className="relative">
            <div className="absolute inset-0 bg-black/50 z-10"></div>

            <div className="relative z-20 container mx-auto py-12 md:py-24 px-4 md:px-0">
                <h2 className="text-4xl md:text-7xl font-bold text-white text-center mb-8 md:mb-16">
                    Estamos aquí
                    <div className="w-24 md:w-32 h-2 bg-yellow-400 mx-auto mt-4"></div>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Columna izquierda - Información */}
                    <div className="text-white space-y-8 md:space-y-16">
                        {/* Horario */}
                        <div>
                            <h3 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">Horario</h3>
                            <div className="space-y-2 md:space-y-3">
                                <p className="text-xl md:text-2xl">Lunes a Domingo</p>
                                <p className="text-xl md:text-2xl">12:00 - 16:00</p>
                                <p className="text-xl md:text-2xl">19:30 - 00:00</p>
                            </div>
                        </div>

                        {/* Dirección y teléfono */}
                        <div className="space-y-4 md:space-y-6">
                            <p className="text-xl md:text-2xl">
                                <a
                                    href="https://maps.app.goo.gl/L4saxCHNuWPVudSR9"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-yellow-400 transition-colors"
                                >
                                    Av. Mediterráneo, 87, 46520 Puerto de Sagunto
                                </a>
                            </p>
                            <p className="text-xl md:text-2xl">

                                <a href="tel:+34962684004" className="hover:text-yellow-400 transition-colors">
                                    Teléfonos: +34 962 684 004
                                </a>
                                {' '} | {' '}
                                <a href="tel:+34961185629" className="hover:text-yellow-400 transition-colors">
                                    +34 961 185 629
                                </a>
                            </p>
                            <button
                                onClick={handleOpenDirections}
                                className="bg-yellow-400 text-black px-6 md:px-8 py-3 md:py-4 rounded-lg text-lg md:text-xl font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2 md:gap-3"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Cómo llegar
                            </button>
                        </div>
                    </div>

                    {/* Columna derecha - Mapa */}
                    <div className="bg-white rounded-lg overflow-hidden shadow-xl h-[300px] md:h-[450px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.771690942891!2d-0.2233844!3d39.6725247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd601444878f0ee7%3A0x95d6a9a2cd97c894!2sAv.%20Mediterr%C3%A1neo%2C%2087%2C%2046520%20Puerto%20de%20Sagunto%2C%20Valencia!5e0!3m2!1ses!2ses!4v1650000000000!5m2!1ses!2ses"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}
