'use client'

import { MapPin, Phone, Clock } from 'lucide-react'

export default function Ubicacion() {
    const isMapExpanded = false

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
        <section id="ubicacion" className="relative bg-gray-50 text-gray-800 py-24">
            <div className="relative z-10 container mx-auto px-4 max-w-7xl">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 tracking-tight">
                    Encuéntranos
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                    <div className="flex flex-col space-y-6">
                        <InfoCard
                            icon={<Clock className="w-5 h-5 text-red-700" />}
                            title="Horario"
                            content={
                                <div className="space-y-1 text-gray-600">
                                    <p>Lunes a Domingo</p>
                                    <p className="font-medium">12:00 - 16:00</p>
                                    <p className="font-medium">19:30 - 00:00</p>
                                </div>
                            }
                        />
                        <InfoCard
                            icon={<MapPin className="w-5 h-5 text-red-700" />}
                            title="Ubicación"
                            content={
                                <>
                                    <p className="mb-4 text-gray-600">
                                        <a
                                            href="https://maps.app.goo.gl/L4saxCHNuWPVudSR9"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-red-700 transition-colors"
                                        >
                                            Av. Mediterráneo, 87<br/>46520 Puerto de Sagunto
                                        </a>
                                    </p>
                                    <button
                                        onClick={handleOpenDirections}
                                        className="w-full bg-white border border-gray-200 text-gray-800 px-4 py-3 rounded-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center shadow-sm"
                                    >
                                        Cómo llegar
                                    </button>
                                </>
                            }
                        />
                        <InfoCard
                            icon={<Phone className="w-5 h-5 text-red-700" />}
                            title="Contacto"
                            content={
                                <>
                                    <div className="space-y-1 mb-4 text-gray-600">
                                        <p>+34 962 684 004</p>
                                        <p>+34 961 185 620</p>
                                    </div>
                                    <button
                                        onClick={handleCall}
                                        className="w-full bg-red-700 text-white px-4 py-3 rounded-sm font-medium hover:bg-red-800 transition-all flex items-center justify-center shadow-sm hover:shadow-md"
                                    >
                                        Llamar
                                    </button>
                                </>
                            }
                        />
                    </div>

                    <div className="flex flex-col h-full rounded-sm overflow-hidden shadow-sm border border-gray-200">
                        <div className={`flex-grow bg-white transition-all duration-300 ${isMapExpanded ? 'aspect-square' : 'aspect-video'} md:aspect-square`}>
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
        <div className="bg-white border border-gray-100 p-8 rounded-sm flex-grow flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 flex items-center text-gray-900 tracking-tight">
                {icon}
                <span className="ml-3">{title}</span>
            </h3>
            <div className="flex-grow flex flex-col justify-between">
                {content}
            </div>
        </div>
    )
}
