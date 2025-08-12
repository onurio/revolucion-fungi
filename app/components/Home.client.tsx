// src/components/Home.tsx
import React, { useEffect } from "react";
import { Link } from "@remix-run/react";

const Home: React.FC = () => {
  useEffect(() => {
    // Enable smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.slice(1);
        const element = document.getElementById(id || '');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <h2 className="text-2xl font-light tracking-wider">REVOLUCIÓN FUNGI</h2>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/fungarium" className="text-white/70 hover:text-white transition-colors font-light">
                Colección
              </Link>
              <a href="#mission" className="text-white/70 hover:text-white transition-colors font-light">
                Misión
              </a>
              <a href="#impact" className="text-white/70 hover:text-white transition-colors font-light">
                Impacto
              </a>
              <a href="#projects" className="text-white/70 hover:text-white transition-colors font-light">
                Proyectos
              </a>
              <a href="#contact" className="text-white/70 hover:text-white transition-colors font-light">
                Contacto
              </a>
            </div>
            <div className="md:hidden">
              <button className="text-white/70 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Full-Screen Image */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="/hero-mushroom.jpg" 
            alt="Hongos del Perú" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight mb-6">
            REVOLUCIÓN
            <span className="block text-4xl sm:text-5xl lg:text-6xl mt-2 text-amber-400">FUNGI</span>
          </h1>
          <p className="text-xl sm:text-2xl font-light text-white/80 mb-12 max-w-3xl mx-auto">
            Un movimiento que redefine nuestra relación con los hongos, 
            integrándolos en la vida cotidiana del Perú
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/fungarium"
              className="group relative px-8 py-4 overflow-hidden rounded-full bg-white text-black font-medium transition-all hover:scale-105"
            >
              <span className="relative z-10">Explorar Fungarium</span>
              <div className="absolute inset-0 bg-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            <a
              href="#mission"
              className="px-8 py-4 rounded-full border border-white/30 hover:bg-white/10 transition-all font-light"
            >
              Descubre Más
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Mission Section with Parallax Effect */}
      <section id="mission" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-light mb-8">
                Nuestra <span className="text-amber-400">Misión</span>
              </h2>
              <p className="text-xl text-white/70 mb-6 leading-relaxed">
                Creando la primera guía de campo de hongos del Perú y estableciendo 
                una red de fungariums para democratizar el conocimiento micológico.
              </p>
              <p className="text-lg text-white/60 leading-relaxed">
                Fundado por Sebastián Enriquez, fotógrafo documentalista convertido en 
                micólogo autodidacta, Revolución Fungi trasciende la conservación tradicional, 
                explorando el potencial de los hongos para resolver desafíos ambientales.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-4xl mb-3">🔬</div>
                  <h3 className="text-lg font-medium mb-2">Investigación</h3>
                  <p className="text-sm text-white/60">Primera guía de campo y laboratorio de biomateriales</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-4xl mb-3">🌱</div>
                  <h3 className="text-lg font-medium mb-2">Conservación</h3>
                  <p className="text-sm text-white/60">Preservación del conocimiento etnomicológico</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-4xl mb-3">📚</div>
                  <h3 className="text-lg font-medium mb-2">Educación</h3>
                  <p className="text-sm text-white/60">Integrando hongos en la vida cotidiana</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="text-4xl mb-3">🤝</div>
                  <h3 className="text-lg font-medium mb-2">Comunidad</h3>
                  <p className="text-sm text-white/60">Trabajo con comunidades Shipibo-Konibo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section with Dynamic Stats */}
      <section id="impact" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-amber-950/20 to-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-light text-center mb-20">
            Nuestro <span className="text-amber-400">Impacto</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center group">
              <div className="text-7xl font-light text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                800+
              </div>
              <p className="text-xl text-white/70">Especies en fungariums</p>
            </div>
            <div className="text-center group">
              <div className="text-7xl font-light text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                6
              </div>
              <p className="text-xl text-white/70">Departamentos con fungarium</p>
            </div>
            <div className="text-center group">
              <div className="text-7xl font-light text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                1°
              </div>
              <p className="text-xl text-white/70">Guía de campo del Perú</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-amber-400/30"></div>
            <div className="space-y-12">
              <div className="flex items-center">
                <div className="flex-1 text-right pr-8">
                  <h3 className="text-2xl font-light mb-2">Guía de Campo</h3>
                  <p className="text-white/60">Primera guía de hongos peruanos publicada</p>
                </div>
                <div className="w-4 h-4 bg-amber-400 rounded-full relative z-10"></div>
                <div className="flex-1 pl-8"></div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-1 pr-8"></div>
                <div className="w-4 h-4 bg-amber-400 rounded-full relative z-10"></div>
                <div className="flex-1 pl-8">
                  <h3 className="text-2xl font-light mb-2">Red de Fungariums</h3>
                  <p className="text-white/60">6 departamentos conectados</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-1 text-right pr-8">
                  <h3 className="text-2xl font-light mb-2">Laboratorio Amazónico</h3>
                  <p className="text-white/60">Primer lab de biomateriales en la Amazonía</p>
                </div>
                <div className="w-4 h-4 bg-amber-400 rounded-full relative z-10"></div>
                <div className="flex-1 pl-8"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-light text-center mb-20">
            Proyectos <span className="text-amber-400">Destacados</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/20 to-transparent p-8 border border-white/10 hover:border-amber-400/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-xl font-medium mb-3 relative z-10">Primera Guía de Campo</h3>
              <p className="text-white/60 text-sm relative z-10">
                Documentación exhaustiva de la flora fúngica peruana
              </p>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-900/20 to-transparent p-8 border border-white/10 hover:border-green-400/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-xl font-medium mb-3 relative z-10">Biomateriales</h3>
              <p className="text-white/60 text-sm relative z-10">
                Investigación de soluciones sostenibles con hongos
              </p>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/20 to-transparent p-8 border border-white/10 hover:border-purple-400/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/0 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-xl font-medium mb-3 relative z-10">Etnomicología</h3>
              <p className="text-white/60 text-sm relative z-10">
                Preservación del saber ancestral Shipibo-Konibo
              </p>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/20 to-transparent p-8 border border-white/10 hover:border-blue-400/50 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-xl font-medium mb-3 relative z-10">Centro de ADN</h3>
              <p className="text-white/60 text-sm relative z-10">
                Futuro hub de secuenciación genética en Lima
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-12">
            La <span className="text-amber-400">Revolución</span> Continúa
          </h2>
          <div className="space-y-6 text-lg text-white/70 leading-relaxed">
            <p>
              Con un Centro de Investigación en Lima equipado con laboratorio y un futuro 
              centro de secuenciación de ADN, más el primer Laboratorio de Biomateriales 
              en la Amazonía Peruana, estamos construyendo la infraestructura necesaria 
              para liderar la revolución micológica en el Perú.
            </p>
            <p>
              Nuestros proyectos abarcan desde la soberanía alimentaria y medicinal, 
              el desarrollo de biomateriales sostenibles, hasta la exploración de la 
              intersección entre micología, arte y espiritualidad.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8">
            Únete a la <span className="text-amber-400">Revolución</span>
          </h2>
          <p className="text-xl text-white/70 mb-12">
            Tu apoyo es fundamental para continuar documentando y conservando 
            la diversidad fúngica del Perú
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/fungarium"
              className="group relative px-8 py-4 overflow-hidden rounded-full bg-amber-400 text-black font-medium transition-all hover:scale-105"
            >
              <span className="relative z-10">Explorar Fungarium</span>
            </Link>
            <a
              href="mailto:micelio@revolucionfungi.com"
              className="px-8 py-4 rounded-full border border-white/30 hover:bg-white/10 transition-all font-light"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 mb-4 md:mb-0">&copy; 2025 Revolución Fungi. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/revolucionfungi" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-amber-400 transition-colors">Instagram</a>
              <a href="mailto:micelio@revolucionfungi.com" className="text-white/50 hover:text-amber-400 transition-colors">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;