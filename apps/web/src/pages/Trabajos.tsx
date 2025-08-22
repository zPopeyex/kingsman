// web/apps/src/pages/Trabajos.tsx
import React, { useState, useEffect, useRef } from "react";
import { X, ExternalLink, Heart } from "lucide-react";
import type { PortfolioImage } from "../utils/imageUtils";
import { buildSrcSet, buildSizes, getAspectRatio } from "../utils/imageUtils";

// Importar los datos del JSON
import portfolioData from "../data/portafolio.json";

// CSS para animaciones
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inyectar CSS
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = spinKeyframes;
  document.head.appendChild(style);
}

// Función triggerReflow global
let reflowQueued = false;
const triggerReflow = () => {
  if (reflowQueued) return;
  reflowQueued = true;
  requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
    reflowQueued = false;
  });
};

const Trabajos: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [isLoading, setIsLoading] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  // Cargar datos del portafolio
  const [images, setImages] = useState<PortfolioImage[]>([]);

  useEffect(() => {
    // Simular carga de datos
    const loadPortfolio = async () => {
      try {
        setImages(portfolioData as PortfolioImage[]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading portfolio:", error);
        setIsLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  // Obtener categorías únicas
  const categories = [
    "Todos",
    ...Array.from(new Set(images.map((img) => img.category))),
  ];

  // Filtrar imágenes por categoría
  const filteredImages =
    selectedCategory === "Todos"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  // Manejar teclado en modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#C7C7C7]">Cargando portafolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white pt-1">
      {/* Header */}
      <header className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-serif text-[#D4AF37] mb-6 tracking-tight">
            Nuestros Trabajos
          </h1>
          <p className="text-lg text-[#C7C7C7] max-w-2xl mx-auto">
            Cada corte es una obra maestra. Descubre la artesanía y precisión
            que define el estilo Kingsman Barber.
          </p>
        </div>
      </header>

      {/* Filtros de categoría */}
      <div className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-6 py-3 rounded-2xl font-medium transition-all duration-300
                  ${
                    selectedCategory === category
                      ? "bg-[#D4AF37] text-[#0B0B0B] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      : "bg-[#1A1A1A] text-[#C7C7C7] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                  }
                  focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 
                  focus:ring-offset-[#0B0B0B]
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de imágenes - Masonry layout */}
      <div className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-auto"
          >
            {filteredImages.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                onClick={() => setSelectedImage(image)}
                priority={image.priority}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal de imagen ampliada */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

// Componente para cada imagen del portafolio
interface ImageCardProps {
  image: PortfolioImage;
  onClick: () => void;
  priority: boolean;
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onClick,
  priority,
  index,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isLocal = image.src.startsWith("/assets/");

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-[#1A1A1A] cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#D4AF37]/20"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Imagen */}
      <div className="relative">
        <img
          src={image.src}
          {...(!isLocal && {
            srcSet: buildSrcSet(image.src, image.width),
            sizes: buildSizes(),
          })}
          alt={image.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          width={image.width}
          height={image.height}
          className={`
            block w-full h-auto transition-all duration-700
            ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
          `}
          style={{ aspectRatio: getAspectRatio(image.width, image.height) }}
          onLoad={() => {
            setIsLoaded(true);
            triggerReflow();
          }}
          onError={() => {
            setIsLoaded(true);
            triggerReflow();
          }}
        />

        {/* Overlay de hover */}
        <div
          className={`
            absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent
            transition-opacity duration-300
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Indicador de categoría */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-medium bg-[#D4AF37]/90 text-[#0B0B0B] rounded-full backdrop-blur-sm">
            {image.category}
          </span>
        </div>

        {/* Contenido de hover */}
        <div
          className={`
            absolute bottom-0 left-0 right-0 p-6 transform transition-all duration-300
            ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }
          `}
        >
          <h3 className="text-xl font-semibold text-white mb-2">
            {image.title}
          </h3>
          <p className="text-[#C7C7C7] text-sm leading-relaxed">
            {image.caption}
          </p>
        </div>

        {/* Borde dorado en hover */}
        <div
          className={`
            absolute inset-0 border-2 border-[#D4AF37] rounded-2xl transition-opacity duration-300
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
        />
      </div>
    </div>
  );
};

// Modal para imagen ampliada
interface ImageModalProps {
  image: PortfolioImage;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0B]/95 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Contenido del modal */}
      <div
        className="relative max-w-4xl max-h-[90vh] bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]/20">
          <div>
            <h2
              id="modal-title"
              className="text-2xl font-semibold text-[#D4AF37]"
            >
              {image.title}
            </h2>
            <p className="text-[#C7C7C7] mt-1">{image.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#D4AF37]/10 transition-colors duration-200"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6 text-[#C7C7C7]" />
          </button>
        </div>

        {/* Imagen ampliada */}
        <div className="relative">
          <img
            src={image.src}
            alt={image.alt}
            className={`
              w-full h-auto max-h-[60vh] object-contain transition-opacity duration-500
              ${imageLoaded ? "opacity-100" : "opacity-0"}
            `}
            onLoad={() => setImageLoaded(true)}
          />

          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Footer del modal */}
        <div className="p-6 border-t border-[#D4AF37]/20">
          <p className="text-[#C7C7C7] leading-relaxed mb-4">{image.caption}</p>
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors duration-200">
              <Heart className="w-4 h-4" />
              <span>Me gusta</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors duration-200">
              <ExternalLink className="w-4 h-4" />
              <span>Compartir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trabajos;
