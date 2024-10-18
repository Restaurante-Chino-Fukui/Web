import Image from 'next/image';

export default function About() {
    return (
        <section id="about" className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-16">Sobre FUKUI</h2>
                <div className="flex flex-col md:flex-row items-center space-y-12 md:space-y-0 md:space-x-12">
                    <div className="md:w-1/2">
                        <Image
                            src="/restaurant-interior.jpg"
                            alt="Interior del restaurante FUKUI"
                            width={600}
                            height={400}
                            objectFit="cover"
                            className="rounded-lg shadow-xl"
                        />
                    </div>
                    <div className="md:w-1/2">
                        <p className="text-xl mb-6 leading-relaxed">
                            FUKUI es un restaurante japonés auténtico que ofrece una experiencia culinaria única en el corazón de la ciudad. Nuestro chef, con más de 20 años de experiencia en la cocina japonesa, trae los sabores más exquisitos y tradicionales de Japón a tu mesa.
                        </p>
                        <p className="text-xl leading-relaxed">
                            Nos enorgullecemos de utilizar ingredientes frescos y de alta calidad, importados directamente de Japón, para garantizar la autenticidad de nuestros platos. En FUKUI, no solo disfrutarás de una comida excepcional, sino también de un ambiente acogedor y un servicio impecable.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
