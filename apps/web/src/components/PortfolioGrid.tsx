import React, { useState, useEffect } from "react";
import { X, ExternalLink, Heart, Filter } from "lucide-react";
import {
  type PortfolioImage,
  buildSrcSet,
  buildSizes,
  getAspectRatio,
} from "../utils/imageUtils";
import { useMasonryLayout } from "../hooks/useMasonryLayout";
import portfolioData from "../data/portafolio.json";

const PortfolioGrid: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<PortfolioImage | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [images] = useState<PortfolioImage[]>(
    portfolioData as PortfolioImage[]
  );

  const { containerRef, isSupported } = useMasonryLayout({
    responsive: {
      1280: { columns: 4, gutter: 24 },
      1024: { columns: 3, gutter: 20 },
      640: { columns: 2, gutter: 16 },
      0: { columns: 1, gutter: 12 },
    },
  });

  const categories = [
    "Todos",
    ...Array.from(new Set(images.map((img) => img.category))),
  ];
  const filteredImages =
    selectedCategory === "Todos"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
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

  return (
    <div className="px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        {/* Header con filtros */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-[#D4AF37] mb-6">
            Galería de Trabajos
          </h2>

          {/* Filtros de categoría */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                  ${
                    selectedCategory === category
                      ? "bg-[#D4AF37] text-[#0B0B0B] shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                      : "bg-[#1A1A1A] text-[#C7C7C7] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37]/30"
                  }
                  border border-transparent
                `}
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid de imágenes */}
        <div
          ref={containerRef}
          className={`
            ${
              isSupported
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "relative"
            }
          `}
          style={isSupported ? { gridTemplateRows: "masonry" } : {}}
        >
          {filteredImages.map((image, index) => (
            <ImageCard
              key={image.id}
              image={image}
              onClick={() => setSelectedImage(image)}
              index={index}
            />
          ))}
        </div>

        {/* Botón para ver más trabajos */}
        <div className="text-center mt-16">
          <button className="group relative inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 to-[#C7A936]/10 border-2 border-[#D4AF37]/30 text-[#D4AF37] font-medium hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0B0B0B] overflow-hidden">
            <span className="relative z-10">Ver Más Trabajos</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/20 to-[#D4AF37]/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </button>
        </div>
      </div>

      {/* Modal de imagen */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

// ImageCard Component
interface ImageCardProps {
  image: PortfolioImage;
  onClick: () => void;
  index: number;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick, index }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="group relative overflow-hidden rounded-2xl bg-[#1A1A1A] cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#D4AF37]/20 focus-within:ring-2 focus-within:ring-[#D4AF37] focus-within:ring-offset-2 focus-within:ring-offset-[#0B0B0B]"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Ver ${image.title} en tamaño completo`}
    >
      {/* Container de imagen */}
      <div className="relative overflow-hidden">
        <img
          src={image.src}
          srcSet={buildSrcSet(image.src, image.width)}
          sizes={buildSizes()}
          alt={image.alt}
          loading={image.priority ? "eager" : "lazy"}
          decoding="async"
          className={`
            w-full h-auto transition-all duration-700 transform
            ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
            ${isHovered ? "scale-110" : "scale-100"}
          `}
          style={{
            aspectRatio: getAspectRatio(image.width, image.height),
          }}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Overlay gradiente */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent
          transition-opacity duration-300
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        />

        {/* Badge de categoría */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 text-xs font-semibold bg-[#D4AF37]/90 text-[#0B0B0B] rounded-full backdrop-blur-sm border border-[#D4AF37]/20">
            {image.category}
          </span>
        </div>

        {/* Contenido de hover */}
        <div
          className={`
          absolute bottom-0 left-0 right-0 p-6 z-10 transform transition-all duration-300
          ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
        `}
        >
          <h3 className="text-xl font-semibold text-white mb-2 font-serif">
            {image.title}
          </h3>
          <p className="text-[#C7C7C7] text-sm leading-relaxed">
            {image.caption}
          </p>

          {/* Indicador de "click para ampliar" */}
          <div className="mt-3 flex items-center text-[#D4AF37] text-xs font-medium">
            <ExternalLink className="w-3 h-3 mr-1" />
            Click para ampliar
          </div>
        </div>

        {/* Borde dorado en hover */}
        <div
          className={`
          absolute inset-0 border-2 border-[#D4AF37] rounded-2xl transition-opacity duration-300 pointer-events-none
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        />

        {/* Efecto shimmer */}
        <div
          className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-transform duration-1000
          ${isHovered ? "translate-x-full" : "-translate-x-full"}
        `}
        />
      </div>
    </article>
  );
};

// ImageModal Component (mismo que antes pero con mejoras de accesibilidad)
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
      aria-describedby="modal-description"
    >
      <div
        className="relative max-w-5xl max-h-[90vh] bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-[#D4AF37]/20">
          <div>
            <h2
              id="modal-title"
              className="text-2xl font-semibold text-[#D4AF37] font-serif"
            >
              {image.title}
            </h2>
            <p className="text-[#C7C7C7] mt-1">{image.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#D4AF37]/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6 text-[#C7C7C7]" />
          </button>
        </header>

        {/* Imagen ampliada */}
        <div className="relative bg-[#0B0B0B]">
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

        {/* Footer */}
        <footer className="p-6 border-t border-[#D4AF37]/20">
          <p
            id="modal-description"
            className="text-[#C7C7C7] leading-relaxed mb-4"
          >
            {image.caption}
          </p>
          <div className="flex items-center justify-between">
            <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
              <Heart className="w-4 h-4" />
              <span>Me gusta</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">
              <ExternalLink className="w-4 h-4" />
              <span>Compartir</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PortfolioGrid;
