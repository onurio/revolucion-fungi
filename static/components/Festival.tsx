import React from "react";
import countries from "../data/countries.json";

/**
 * Festival Brand Colors (from poster)
 * Verde: RGB(60, 141, 31) - #3c8d1f
 * Rojo: RGB(217, 76, 74) - #d94c4a
 * Verde claro: RGB(121, 184, 147) - #79b893
 * Celeste: RGB(66, 192, 229) - #42c0e5
 * Amarillo: RGB(235, 193, 4) - #ebc104
 * Rosa: RGB(226, 154, 142) - #e29a8e
 * Azul: RGB(1, 135, 197) - #0187c5
 */

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-200 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <a href="#top" className="flex items-center">
            <img
              src="/festival-logo.png"
              alt="Revolución Fungi Fest"
              className="h-12"
            />
          </a>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#info" className="text-gray-700 hover:text-orange-500 transition-colors font-bold uppercase">
              Información
            </a>
            <a href="#actividades" className="text-gray-700 hover:text-orange-500 transition-colors font-bold uppercase">
              Actividades
            </a>
            <a href="#entrada" className="text-gray-700 hover:text-orange-500 transition-colors font-bold uppercase">
              Adquiere tu entrada
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section
      className="bg-white bg-contain bg-center bg-no-repeat"
      style={{
        minHeight: 'var(--screen-height)',
        backgroundImage: 'url(/festival-poster.jpg)'
      }}
    >
    </section>
  );
};

const InfoSection: React.FC = () => {
  return (
    <section id="info" className="bg-white mt-16" style={{ scrollMarginTop: 'var(--navbar-height)' }}>
      <div
        className="relative w-full bg-cover bg-center bg-no-repeat min-h-screen flex items-center"
        style={{
          backgroundImage: 'url(/info-bg-new.jpg)'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="space-y-6 text-white leading-relaxed">
            <p className="text-xl md:text-2xl font-bold text-justify">
              Revolución Fungi Fest - Oxapampa 2026 es el primer festival en la historia del Perú dedicado íntegramente al Reino Fungi que se realizará del 26 de febrero al 01 de marzo de 2026.
            </p>

            <p className="text-base md:text-lg text-justify">
              El Revolución Fungi Fest – Festival de los Hongos del Perú es un movimiento ciudadano enfocado en la ciencia, la cultura y la comunidad que reune destacados micólogos, artistas, científicos, representantes comunitarios, pueblos originarios, conservacionistas, emprendedores y entusiastas de los hongos para explorar todo lo relacionado al Reino Fungi. Más que un festival, somos un encuentro donde la comunidad fungi se reune para celebrar a los hongos y su impacto en el mundo. ¡Celebremos nuestro amor por los hongos!
            </p>

            <p className="text-base md:text-lg text-justify">
              Como festival sin fines de lucro, les pedimos cordialmente que consideren apoyar nuestras actividades, cuyo objetivo es mantener los costos para nuestros invitados y asistentes lo más accesibles posible. Cualquier donación marca la diferencia y nos ayuda a cubrir alojamiento y transporte para nuestros invitados que llegan desde otras partes del mundo, becas para nuestros colaboradores y nuestros programas comunitarios gratuitos. Si donar no es una opción, les pedimos que compartan información sobre RFF; todo apoyo importa.
            </p>

            <p className="text-base md:text-lg">
              ¡Esperamos verte en las montañas de Oxapampa este febrero!
            </p>
          </div>
        </div>
      </div>

      {/* How to Participate Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ¿CÓMO PARTICIPAR DEL FESTIVAL?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Tenemos programados muchos talleres, charlas, conferencias, feria fungi, pasacalle, salidas al bosque a observar hongos, exposiciones de arte y fotografía, música en vivo, gastronomía, cine y otros eventos inéditos para el festival este año. Aquí encontrarás información útil: programa de actividades, cronograma, invitados, como adquirir tu entrada o participar con un stand.
          </p>
        </div>
      </div>
    </section>
  );
};

const ActividadesSection: React.FC = () => {
  const activities = [
    {
      title: "Feria Fungi",
      description: "Exhibición de emprendimientos y venta de productos y tecnologías basadas en hongos, así como talleres gratuitos dirigidos al público en general.",
      color: "#d94c4a"
    },
    {
      title: "Ciclo de Conferencias",
      description: "Charlas magistrales en el Auditorio Municipal, a cargo de expertos nacionales e internacionales provenientes de EE.UU., Holanda, Argentina, Colombia, Chile y diversas universidades, ONG´s e institutos de investigación nacionales (UNALM, UNTRM, UNSAC, UNAS, entre otros).",
      color: "#3c8d1f"
    },
    {
      title: "Salidas al Bosque",
      description: "Actividades guiadas por expertos para la identificación de hongos en los bosques del Parque Nacional Yanachaga Chemillén y la Ecoaldea Tierra de Bosques. Nos acompañará un tour bioacústico en vivo.",
      color: "#42c0e5"
    },
    {
      title: "Talleres Especializados",
      description: "Capacitación en vivo por expertos internacionales en el cultivo de hongos, medicina fungi, gastronomía y otros temas, en la Biblioteca Municipal.",
      color: "#ebc104"
    },
    {
      title: "Exposición Fotográfica \"Hongos de Oxapampa\"",
      description: "Exposición de especies de hongos representativas de la provincia de Oxapampa, a desarrollarse en la glorieta del Pasaje Los Colonos.",
      color: "#79b893"
    },
    {
      title: "Intervención Artística",
      description: "Intervención en vivo sobre la riqueza fúngica local a cargo de tres (03) artistas nacionales reconocidos.",
      color: "#e29a8e"
    },
    {
      title: "Cinema Oxapampa",
      description: "Proyección de películas y documentales sobre el Reino Fungi.",
      color: "#0187c5"
    },
    {
      title: "Noches Culturales",
      description: "Presentaciones de bandas y grupos musicales así como lanzamientos sorpresa.",
      color: "#d94c4a"
    },
    {
      title: "Pasacalle Cultural",
      description: "Recorrido por la Plaza Principal con comparsas, comunidades nativas, instituciones y pobladores celebrando nuestra identidad y biodiversidad.",
      color: "#3c8d1f"
    }
  ];

  return (
    <section id="actividades" className="bg-white py-4 mt-4" style={{ scrollMarginTop: 'var(--navbar-height)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">ACTIVIDADES</h2>

        <p className="text-gray-700 text-sm leading-snug mb-4">
          Como parte del programa, se desarrollarán actividades sociales y culturales orientadas a integrar a la comunidad, fomentar el intercambio de conocimiento entre visitantes nacionales e internacionales y destacar el carácter artístico, científico, productivo y hospitalario de Oxapampa. Entre ellas:
        </p>

        <div className="space-y-2">
          {activities.map((activity, idx) => (
            <div
              key={idx}
              className="border-l-4 pl-3 py-1"
              style={{ borderLeftColor: activity.color }}
            >
              <h3
                className="text-base md:text-lg font-bold mb-1 uppercase"
                style={{ color: activity.color }}
              >
                {activity.title}
              </h3>
              <p className="text-gray-700 text-xs leading-snug">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection: React.FC = () => {
  return (
    <section id="entrada" className="bg-white py-16 mt-16" style={{ scrollMarginTop: 'var(--navbar-height)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Image (visible on desktop) */}
          <div className="hidden lg:block">
            <img
              src="/contact-bg.jpg"
              alt="Revolución Fungi Fest"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Right side - Form */}
          <div className="relative p-8 rounded-lg min-h-[600px] lg:min-h-0 contact-form-wrapper">
            <style dangerouslySetInnerHTML={{ __html: `
              @media (max-width: 1023px) {
                .contact-form-wrapper {
                  background-image: url(/contact-bg.jpg);
                  background-size: cover;
                  background-position: center;
                }
              }
            ` }} />
            {/* Dark overlay for mobile readability */}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg lg:hidden"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8 text-white lg:text-[#42c0e5]">ADQUIERE TU ENTRADA</h2>
              <form id="contact-form" className="space-y-6">
              <div>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div className="flex gap-2">
                <select
                  id="codigo_pais"
                  name="codigo_pais"
                  required
                  className="w-20 px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="">+ País</option>
                  {countries.map((country, idx) => (
                    <option key={idx} value={country.code}>
                      {country.flag} {country.name} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="999 999 999"
                />
              </div>

              <button
                type="submit"
                className="w-full text-white font-bold py-3 px-6 rounded-lg transition-all uppercase hover-button"
                style={{ backgroundColor: '#42c0e5' }}
              >
                Enviar
              </button>
              <style dangerouslySetInnerHTML={{ __html: `
                .hover-button:hover {
                  background-color: #0187c5 !important;
                  transform: translateY(-2px);
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }
              ` }} />

              <div id="form-message" className="text-center text-sm"></div>
            </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0">&copy; 2025 Revolución Fungi. Todos los derechos reservados.</p>
          <div className="flex space-x-6">
            <a href="https://www.instagram.com/revolucionfungifest" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-500 transition-colors">Instagram</a>
            <a href="mailto:info@revolucionfungi.com" className="text-gray-500 hover:text-orange-500 transition-colors">Email</a>
            <a href="tel:+51920621682" className="text-gray-500 hover:text-orange-500 transition-colors">+51 920 621 682</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Festival: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --navbar-height: 9rem;
          --screen-height: calc(100vh - var(--navbar-height));
        }
      ` }} />
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        <InfoSection />
        <ActividadesSection />
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Festival;
