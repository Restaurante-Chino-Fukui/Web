'use client'

import { useState } from 'react'
import { MapPin, Phone, Clock } from 'lucide-react'

export default function Ubicacion() {
    const [isMapExpanded, setIsMapExpanded] = useState(false)

    const handleOpenDirections = () => {
        window.open('https://maps.app.goo.gl/L4saxCHNuWPVudSR9', '_blank')
    }

    const handleCall = () => {
        const phoneNumbers = [
            { number: '+34962684004', label: 'Teléfono 1' },
            { number: '+34961185629', label: 'Teléfono 2' }
        ]
        phoneNumbers.forEach(phone => {
            const link = document.createElement('a')
            link.href = `tel:${phone.number}`
            link.click()
        })
    }

    return (
        <section id="ubicacion" className="relative bg-gray-900 text-white py-16">
            <div className="absolute inset-0 bg-[url('/restaurant-bg.jpg')] bg-cover bg-center opacity-25"></div>
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold text-center mb-12">
                    Estamos aquí
                    <div className="w-24 h-1 bg-yellow-400 mx-auto mt-4"></div>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <div className="flex flex-col space-y-8">
                        <InfoCard
                            icon={<Clock className="w-6 h-6" />}
                            title="Horario"
                            content={
                                <div className="space-y-2">
                                    <p>Lunes a Domingo</p>
                                    <p>12:00 - 16:00</p>
                                    <p>19:30 - 00:00</p>
                                </div>
                            }
                        />
                        <InfoCard
                            icon={<MapPin className="w-6 h-6" />}
                            title="Dirección"
                            content={
                                <>
                                    <p className="mb-4">
                                        <a
                                            href="https://maps.app.goo.gl/L4saxCHNuWPVudSR9"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-yellow-400 transition-colors"
                                        >
                                            Av. Mediterráneo, 87, 46520 Puerto de Sagunto
                                        </a>
                                    </p>
                                    <button
                                        onClick={handleOpenDirections}
                                        className="w-full bg-yellow-400 text-black px-4 py-2 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center"
                                    >
                                        <MapPin className="mr-2 w-5 h-5" /> Cómo llegar
                                    </button>
                                </>
                            }
                        />
                        <InfoCard
                            icon={<Phone className="w-6 h-6" />}
                            title="Teléfonos"
                            content={
                                <>
                                    <div className="space-y-2 mb-4">
                                        <p>+34 962 684 004</p>
                                        <p>+34 961 185 629</p>
                                    </div>
                                    <button
                                        onClick={handleCall}
                                        className="w-full bg-green-500 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                                    >
                                        <Phone className="mr-2 w-5 h-5" /> Llámanos ya
                                    </button>
                                </>
                            }
                        />
                    </div>

                    <div className="flex flex-col h-full">
                        <div className={`flex-grow bg-white rounded-lg overflow-hidden shadow-xl transition-all duration-300 ${isMapExpanded ? 'aspect-square' : 'aspect-video'} md:aspect-square`}>
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
                        <button
                            onClick={() => setIsMapExpanded(!isMapExpanded)}
                            className="mt-4 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors self-center md:hidden"
                        >
                            {isMapExpanded ? 'Reducir mapa' : 'Ampliar mapa'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    content: React.ReactNode;
}

function InfoCard({ icon, title, content }: InfoCardProps) {
    return (
        <div className="bg-black bg-opacity-50 p-6 rounded-lg flex-grow flex flex-col">
            <h3 className="text-2xl font-semibold mb-4 flex items-center">
                {icon}
                <span className="ml-2">{title}</span>
            </h3>
            <div className="flex-grow flex flex-col justify-between">
                {content}
            </div>
        </div>
    )
}