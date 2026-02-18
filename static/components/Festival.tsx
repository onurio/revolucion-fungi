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
    <>
      <nav className="fixed top-0 w-full bg-white z-50 border-b border-gray-200 h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between md:justify-between h-full">
            {/* Mobile menu button - left side */}
            <button
              id="mobile-menu-button"
              className="md:hidden p-2 text-gray-700 hover:text-orange-500 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo - centered on mobile, left on desktop */}
            <a href="#top" className="flex items-center absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none">
              <img
                src="/festival-logo.png"
                alt="Revolución Fungi Fest"
                className="h-12 object-contain"
              />
            </a>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#info" className="text-gray-700 hover:text-orange-500 transition-colors font-bold uppercase">
                Información
              </a>
              <a href="#actividades" className="text-gray-700 hover:text-orange-500 transition-colors font-bold uppercase">
                Actividades
              </a>
              <a href="#contacto" className="text-gray-700 hover:text-orange-500 transition-colors font-bold uppercase">Contacto</a>
              <a href="https://tickets.revolucionfungifest.com" target="_blank" rel="noopener noreferrer" className="bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase px-5 py-2 rounded-full transition-colors">Compra tu Entrada</a>
            </div>

            {/* Spacer for mobile to balance the centered logo */}
            <div className="md:hidden w-10"></div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden hidden"
      >
        <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg transform -translate-x-full transition-transform duration-300" id="mobile-menu-panel">
          <div className="flex flex-col p-6 pt-24 space-y-6">
            <a href="#info" className="mobile-menu-link text-gray-700 hover:text-orange-500 transition-colors font-bold uppercase text-lg">
              Información
            </a>
            <a href="#actividades" className="mobile-menu-link text-gray-700 hover:text-orange-500 transition-colors font-bold uppercase text-lg">
              Actividades
            </a>
            <a href="#contacto" className="mobile-menu-link text-gray-700 hover:text-orange-500 transition-colors font-bold uppercase text-lg">
              Contacto
            </a>
            <a href="https://tickets.revolucionfungifest.com" target="_blank" rel="noopener noreferrer" className="mobile-menu-link block bg-orange-500 hover:bg-orange-600 text-white text-center font-bold uppercase text-lg px-4 py-3 rounded-xl transition-colors">Compra tu Entrada</a>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const menuButton = document.getElementById('mobile-menu-button');
          const mobileMenu = document.getElementById('mobile-menu');
          const mobileMenuPanel = document.getElementById('mobile-menu-panel');
          const menuLinks = document.querySelectorAll('.mobile-menu-link');

          function openMenu() {
            mobileMenu.classList.remove('hidden');
            setTimeout(() => {
              mobileMenuPanel.classList.remove('-translate-x-full');
            }, 10);
          }

          function closeMenu() {
            mobileMenuPanel.classList.add('-translate-x-full');
            setTimeout(() => {
              mobileMenu.classList.add('hidden');
            }, 300);
          }

          menuButton.addEventListener('click', openMenu);
          mobileMenu.addEventListener('click', function(e) {
            if (e.target === mobileMenu) {
              closeMenu();
            }
          });

          menuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
          });
        })();
      ` }} />
    </>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section
      className="bg-white flex items-center justify-center py-8 px-4"
      style={{
        height: 'var(--screen-height)'
      }}
    >
      <img
        src="/festival-poster.jpg"
        alt="Revolución Fungi Fest 2026"
        className="max-w-full max-h-full object-contain"
      />
    </section>
  );
};

const PartnersSection: React.FC = () => {
  const logos: { src: string; alt: string; height?: string; maxWidth?: string }[] = [
    { src: '/partner_logos/clean/revolucion-fungi.png', alt: 'Revolución Fungi' },
    { src: '/partner_logos/clean/parque-yanachaga.jpg', alt: 'Parque Nacional Yanachaga-Chemillén SERNANP' },
    { src: '/partner_logos/clean/municipalidad-oxapampa.svg', alt: 'Municipalidad de Oxapampa' },
    { src: '/partner_logos/clean/bioay.png', alt: 'BIOAY', height: '100px', maxWidth: '220px' },
    { src: '/partner_logos/clean/kowen-antami.png', alt: 'Consorcio Kowen Antami' },
    { src: '/partner_logos/clean/cinema-oxa.png', alt: 'Cinema Oxa' },
  ];

  return (
    <section className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-8">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              style={{
                height: logo.height || '60px',
                maxWidth: logo.maxWidth || '140px',
                objectFit: 'contain',
                filter: 'none',
              }}
            />
          ))}
        </div>
      </div>
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
            <p className="text-2xl font-bold text-justify">
              Revolución Fungi Fest - Oxapampa 2026 es el primer festival en la historia del Perú dedicado íntegramente al Reino Fungi que se realizará del 26 de febrero al 01 de marzo de 2026.
            </p>

            <p className="text-base text-justify">
              El Revolución Fungi Fest – Festival de los Hongos del Perú es un movimiento ciudadano enfocado en la ciencia, la cultura y la comunidad que reune destacados micólogos, artistas, científicos, representantes comunitarios, pueblos originarios, conservacionistas, emprendedores y entusiastas de los hongos para explorar todo lo relacionado al Reino Fungi. Más que un festival, somos un encuentro donde la comunidad fungi se reune para celebrar a los hongos y su impacto en el mundo. ¡Celebremos nuestro amor por los hongos!
            </p>

            <p className="text-base text-justify">
              Como festival sin fines de lucro, les pedimos cordialmente que consideren apoyar nuestras actividades, cuyo objetivo es mantener los costos para nuestros invitados y asistentes lo más accesibles posible. Cualquier donación marca la diferencia y nos ayuda a cubrir alojamiento y transporte para nuestros invitados que llegan desde otras partes del mundo, becas para nuestros colaboradores y nuestros programas comunitarios gratuitos. Si donar no es una opción, les pedimos que compartan información sobre RFF; todo apoyo importa.
            </p>

            <p className="text-base">
              ¡Esperamos verte en las montañas de Oxapampa este febrero!
            </p>
          </div>
        </div>
      </div>

      {/* How to Participate Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ¿CÓMO PARTICIPAR DEL FESTIVAL?
          </h2>
          <p className="text-base text-gray-700 leading-relaxed text-justify">
            Tenemos programados muchos talleres, charlas, conferencias, feria fungi, pasacalle, salidas al bosque a observar hongos, exposiciones de arte y fotografía, música en vivo, gastronomía, cine y otros eventos inéditos para el festival este año. Aquí encontrarás información útil: programa de actividades, cronograma, invitados, como adquirir tu entrada o participar con un stand.
          </p>
        </div>
      </div>
    </section>
  );
};

const VisualActivitiesSection: React.FC = () => {
  const categories = [
    {
      id: 'masterclass',
      title: 'MASTERCLASS Y CONVERSATORIOS',
      image: '/activities/categories/03.jpg',
      alt: 'Masterclass y Conversatorios',
      activities: [
        {
          name: 'Dra. María Holgado',
          subtitle: 'Sembrando Micelio en los Andes',
          images: [
            '/activities/masterclass/maria-holgado-01.jpg',
            '/activities/masterclass/maria-holgado-02.jpg',
            '/activities/masterclass/maria-holgado-03.jpg'
          ]
        },
        {
          name: 'Ing. Ingrid Illiquin',
          subtitle: 'Maestría en Micología',
          images: [
            '/activities/masterclass/ingrid-illiquin-01.jpg',
            '/activities/masterclass/ingrid-illiquin-02.jpg',
            '/activities/masterclass/ingrid-illiquin-03.jpg'
          ]
        },
        {
          name: 'Santiago Acosta',
          subtitle: 'Experto Internacional',
          images: [
            '/activities/masterclass/santiago-acosta-01.jpg',
            '/activities/masterclass/santiago-acosta-02.jpg',
            '/activities/masterclass/santiago-acosta-03.jpg',
            '/activities/masterclass/santiago-acosta-04.jpg'
          ]
        },
        {
          name: 'Alan Rockefeller',
          subtitle: 'Experto Internacional',
          images: [
            '/activities/masterclass/alan-rockefeller-01.jpg',
            '/activities/masterclass/alan-rockefeller-02.jpg',
            '/activities/masterclass/alan-rockefeller-03.jpg',
            '/activities/masterclass/alan-rockefeller-04.jpg',
            '/activities/masterclass/alan-rockefeller-05.jpg',
            '/activities/masterclass/alan-rockefeller-06.jpg'
          ]
        },
        {
          name: 'Santiago Jaramillo',
          subtitle: 'Experto Internacional',
          images: [
            '/activities/masterclass/santiago-jaramillo-01.jpg',
            '/activities/masterclass/santiago-jaramillo-02.jpg',
            '/activities/masterclass/santiago-jaramillo-03.jpg',
            '/activities/masterclass/santiago-jaramillo-04.jpg'
          ]
        },
        {
          name: 'Webinars',
          subtitle: 'Charlas Virtuales',
          images: [
            '/activities/masterclass/webinars-01.jpg',
            '/activities/masterclass/webinars-02.jpg',
            '/activities/masterclass/webinars-03.jpg'
          ]
        }
      ]
    },
    {
      id: 'talleres',
      title: 'TALLERES',
      image: '/activities/categories/04.jpg',
      alt: 'Talleres',
      activities: [
        {
          name: 'Koa Prato',
          subtitle: 'Ilustración Científica Fungi',
          images: [
            '/activities/talleres/koa-prato-01.jpg',
            '/activities/talleres/koa-prato-02.jpg',
            '/activities/talleres/koa-prato-03.jpg'
          ]
        }
      ]
    },
    {
      id: 'feria',
      title: 'FERIA FUNGI',
      image: '/activities/categories/05.jpg',
      alt: 'Feria Fungi',
      activities: []
    },
    {
      id: 'caminatas',
      title: 'CAMINATAS EN EL BOSQUE',
      image: '/activities/categories/06.jpg',
      alt: 'Caminatas en el Bosque',
      activities: []
    },
    {
      id: 'cultural',
      title: 'CINE / NOCHES CULTURALES / EXPOSICIÓN',
      image: '/activities/categories/07.jpg',
      alt: 'Actividades Culturales',
      activities: []
    },
    {
      id: 'pasacalle',
      title: 'PASACALLE FUNGI',
      image: '/activities/categories/08.jpg',
      alt: 'Pasacalle Fungi',
      activities: []
    }
  ];

  return (
    <>
      <section id="actividades" className="bg-white py-12" style={{ scrollMarginTop: 'var(--navbar-height)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            NUESTRAS ACTIVIDADES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <div
                key={category.id}
                className="cursor-pointer category-card relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all group"
                data-category-id={category.id}
              >
                <img
                  src={category.image}
                  alt={category.alt}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 md:group-hover:bg-opacity-40 transition-all duration-300 flex items-end md:items-center justify-center pb-6 md:pb-0">
                  <button className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-sm md:text-base opacity-100 md:opacity-0 md:group-hover:opacity-100 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-gray-100">
                    VER MÁS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity List Modal */}
      <div id="activity-modal" className="hidden fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-5xl w-full my-8 p-6 md:p-8">
            <button
              id="close-activity-modal"
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <h3 id="activity-modal-title" className="text-2xl font-bold text-gray-900 mb-6 text-center"></h3>
            <div id="activity-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            <div id="no-activities-message" className="hidden text-center py-12">
              <p className="text-xl text-gray-600">Próximamente más información</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel Modal */}
      <div id="carousel-modal" className="hidden fixed inset-0 bg-black bg-opacity-90 z-50">
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4">
            <button
              id="back-to-activities"
              className="text-white hover:text-gray-300 text-lg font-bold flex items-center gap-2"
            >
              <span>&larr;</span> Volver
            </button>
            <h3 id="carousel-activity-name" className="text-white text-xl font-bold flex-1 text-center"></h3>
            <button
              id="close-carousel-modal"
              className="text-white hover:text-gray-300 text-3xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-4">
            <button
              id="carousel-prev"
              className="text-white hover:text-gray-300 text-4xl font-bold px-4 md:px-8"
              aria-label="Previous"
            >
              &lsaquo;
            </button>
            <div className="flex-1 max-w-4xl">
              <img
                id="carousel-image"
                src=""
                alt=""
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
            <button
              id="carousel-next"
              className="text-white hover:text-gray-300 text-4xl font-bold px-4 md:px-8"
              aria-label="Next"
            >
              &rsaquo;
            </button>
          </div>
          <div id="carousel-dots" className="flex justify-center gap-2 p-4"></div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const categoriesData = ${JSON.stringify(categories)};

          // Modal elements
          const activityModal = document.getElementById('activity-modal');
          const carouselModal = document.getElementById('carousel-modal');
          const activityModalTitle = document.getElementById('activity-modal-title');
          const activityList = document.getElementById('activity-list');
          const noActivitiesMessage = document.getElementById('no-activities-message');
          const carouselImage = document.getElementById('carousel-image');
          const carouselDots = document.getElementById('carousel-dots');
          const carouselActivityName = document.getElementById('carousel-activity-name');

          let currentCategory = null;
          let currentActivityImages = [];
          let currentImageIndex = 0;
          let currentActivityName = '';

          // Category card click handlers
          document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', function() {
              const categoryId = this.dataset.categoryId;
              openActivityModal(categoryId);
            });
          });

          function openActivityModal(categoryId) {
            currentCategory = categoriesData.find(c => c.id === categoryId);
            if (!currentCategory) return;

            activityModalTitle.textContent = currentCategory.title;

            if (currentCategory.activities.length === 0) {
              activityList.classList.add('hidden');
              noActivitiesMessage.classList.remove('hidden');
            } else {
              activityList.classList.remove('hidden');
              noActivitiesMessage.classList.add('hidden');

              activityList.innerHTML = '';
              currentCategory.activities.forEach((activity, index) => {
                const activityCard = document.createElement('div');
                activityCard.className = 'cursor-pointer hover:opacity-90 transition-opacity';
                activityCard.innerHTML = \`
                  <div class="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-orange-500 transition-colors">
                    <img src="\${activity.images[0]}" alt="\${activity.name}" class="w-full h-64 object-cover" />
                    <div class="p-4">
                      <h4 class="font-bold text-gray-900 text-lg">\${activity.name}</h4>
                      <p class="text-gray-600 text-sm">\${activity.subtitle}</p>
                    </div>
                  </div>
                \`;
                activityCard.addEventListener('click', () => openCarousel(activity.images, activity.name));
                activityList.appendChild(activityCard);
              });
            }

            activityModal.classList.remove('hidden');
          }

          function openCarousel(images, activityName) {
            currentActivityImages = images;
            currentActivityName = activityName;
            currentImageIndex = 0;
            carouselActivityName.textContent = activityName;
            updateCarouselImage();
            activityModal.classList.add('hidden');
            carouselModal.classList.remove('hidden');
          }

          function updateCarouselImage() {
            carouselImage.src = currentActivityImages[currentImageIndex];

            // Update dots
            carouselDots.innerHTML = '';
            currentActivityImages.forEach((_, index) => {
              const dot = document.createElement('button');
              dot.className = 'w-3 h-3 rounded-full transition-colors ' +
                (index === currentImageIndex ? 'bg-white' : 'bg-gray-500');
              dot.addEventListener('click', () => {
                currentImageIndex = index;
                updateCarouselImage();
              });
              carouselDots.appendChild(dot);
            });
          }

          // Close modal handlers
          document.getElementById('close-activity-modal').addEventListener('click', () => {
            activityModal.classList.add('hidden');
          });

          document.getElementById('close-carousel-modal').addEventListener('click', () => {
            carouselModal.classList.add('hidden');
          });

          document.getElementById('back-to-activities').addEventListener('click', () => {
            carouselModal.classList.add('hidden');
            if (currentCategory && currentCategory.activities.length > 0) {
              activityModal.classList.remove('hidden');
            }
          });

          // Carousel navigation
          document.getElementById('carousel-prev').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + currentActivityImages.length) % currentActivityImages.length;
            updateCarouselImage();
          });

          document.getElementById('carousel-next').addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % currentActivityImages.length;
            updateCarouselImage();
          });

          // Keyboard navigation
          document.addEventListener('keydown', (e) => {
            if (!carouselModal.classList.contains('hidden')) {
              if (e.key === 'ArrowLeft') {
                document.getElementById('carousel-prev').click();
              } else if (e.key === 'ArrowRight') {
                document.getElementById('carousel-next').click();
              } else if (e.key === 'Escape') {
                document.getElementById('close-carousel-modal').click();
              }
            } else if (!activityModal.classList.contains('hidden')) {
              if (e.key === 'Escape') {
                document.getElementById('close-activity-modal').click();
              }
            }
          });

          // Click outside to close
          activityModal.addEventListener('click', (e) => {
            if (e.target === activityModal) {
              activityModal.classList.add('hidden');
            }
          });

          carouselModal.addEventListener('click', (e) => {
            if (e.target === carouselModal) {
              carouselModal.classList.add('hidden');
            }
          });
        })();
      ` }} />
    </>
  );
};

const ContactSection: React.FC = () => {
  return (
    <section id="contacto" className="bg-white py-16 mt-16" style={{ scrollMarginTop: 'var(--navbar-height)' }}>
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
              <h2 className="text-3xl font-bold mb-8 text-white lg:text-[#42c0e5]">CONTACTO</h2>
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
                id="submit-button"
                type="submit"
                className="w-full text-white font-bold py-3 px-6 rounded-lg transition-all uppercase hover-button flex items-center justify-center gap-2"
                style={{ backgroundColor: '#42c0e5' }}
              >
                <svg
                  id="button-spinner"
                  className="hidden animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span id="button-text">Enviar</span>
              </button>
              <style dangerouslySetInnerHTML={{ __html: `
                .hover-button:hover:not(:disabled) {
                  background-color: #0187c5 !important;
                  transform: translateY(-2px);
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }
                .hover-button:disabled {
                  opacity: 0.7;
                  cursor: not-allowed;
                }
                @keyframes spin {
                  from {
                    transform: rotate(0deg);
                  }
                  to {
                    transform: rotate(360deg);
                  }
                }
                .animate-spin {
                  animation: spin 1s linear infinite;
                }
              ` }} />
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
          <p className="text-gray-500 mb-4 md:mb-0">&copy; 2026 Revolución Fungi. Todos los derechos reservados.</p>
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
        @font-face {
          font-family: 'AmsiPro';
          src: url('/fonts/AmsiPro-Regular.otf') format('opentype');
          font-weight: 400;
          font-style: normal;
        }
        @font-face {
          font-family: 'AmsiPro';
          src: url('/fonts/AmsiPro-SemiBold.otf') format('opentype');
          font-weight: 600;
          font-style: normal;
        }
        @font-face {
          font-family: 'AmsiPro';
          src: url('/fonts/AmsiPro-Bold.otf') format('opentype');
          font-weight: 700;
          font-style: normal;
        }
        @font-face {
          font-family: 'AmsiPro';
          src: url('/fonts/AmsiPro-Black.otf') format('opentype');
          font-weight: 900;
          font-style: normal;
        }

        :root {
          --navbar-height: 5rem;
          --screen-height: calc(100vh - var(--navbar-height));
        }

        body {
          font-family: 'AmsiPro', sans-serif;
          color: #000000;
        }

        h1, h2, h3, h4, h5, h6 {
          font-weight: 700;
        }

        p {
          font-weight: 600;
        }
      ` }} />
      <Navbar />
      <div className="pt-20">
        <HeroSection />
        <InfoSection />
        <VisualActivitiesSection />
        <ContactSection />
        <PartnersSection />
      </div>
      <Footer />

      {/* Floating ticket CTA — mobile only */}
      <a
        href="https://tickets.revolucionfungifest.com"
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase px-6 py-3 rounded-full shadow-lg transition-colors whitespace-nowrap"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
        </svg>
        Compra tu Entrada
      </a>
    </div>
  );
};

export default Festival;
