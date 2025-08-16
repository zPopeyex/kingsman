// web/apps/src/components/admin/PortfolioManager.tsx
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, Save, X } from "lucide-react";
import type { PortfolioImage } from "../../utils/imageUtils";

interface PortfolioManagerProps {
  // Props para integración con tu sistema de datos
}

const PortfolioManager: React.FC<PortfolioManagerProps> = () => {
  const [works, setWorks] = useState<PortfolioImage[]>([]);
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [editingWork, setEditingWork] = useState<PortfolioImage | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Cargar trabajos existentes
  useEffect(() => {
    loadPortfolioWorks();
  }, []);

  const loadPortfolioWorks = async () => {
    try {
      // Aquí conectarías con tu backend/base de datos
      // Por ahora simulamos con el JSON actual
      const response = await fetch("/api/portfolio-works");
      const data = await response.json();
      setWorks(data);
    } catch (error) {
      console.error("Error loading portfolio works:", error);
      // Fallback con datos locales
      import("../../data/portafolio.json").then((data) => {
        setWorks(data.default as PortfolioImage[]);
      });
    }
  };

  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Crear FormData para upload
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "portafolio");

      // Aquí harías el upload real a tu servidor/cloud storage
      // Por ahora simulamos
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);

        // Simular URL del servidor
        const fakeServerUrl = `/assets/images/portafolio/${file.name}`;
        resolve(fakeServerUrl);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const saveWork = async (workData: Partial<PortfolioImage>) => {
    try {
      const method = workData.id ? "PUT" : "POST";
      const url = workData.id
        ? `/api/portfolio-works/${workData.id}`
        : "/api/portfolio-works";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workData),
      });

      if (response.ok) {
        await loadPortfolioWorks(); // Recargar lista
        setIsAddingWork(false);
        setEditingWork(null);
        setPreviewImage(null);
      }
    } catch (error) {
      console.error("Error saving work:", error);
    }
  };

  const deleteWork = async (workId: string) => {
    if (!confirm("¿Estás seguro de eliminar este trabajo?")) return;

    try {
      await fetch(`/api/portfolio-works/${workId}`, { method: "DELETE" });
      await loadPortfolioWorks();
    } catch (error) {
      console.error("Error deleting work:", error);
    }
  };

  return (
    <div className="bg-[#0B0B0B] min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#D4AF37] mb-2">
              Gestión de Portafolio
            </h1>
            <p className="text-[#C7C7C7]">
              Administra los trabajos que se muestran en la galería
            </p>
          </div>
          <button
            onClick={() => setIsAddingWork(true)}
            className="flex items-center space-x-2 bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 rounded-xl font-semibold hover:bg-[#F4D061] transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Trabajo</span>
          </button>
        </div>

        {/* Grid de trabajos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {works.map((work) => (
            <WorkCard
              key={work.id}
              work={work}
              onEdit={() => setEditingWork(work)}
              onDelete={() => deleteWork(work.id)}
            />
          ))}
        </div>

        {/* Modal para agregar/editar trabajo */}
        {(isAddingWork || editingWork) && (
          <WorkFormModal
            work={editingWork}
            onSave={saveWork}
            onClose={() => {
              setIsAddingWork(false);
              setEditingWork(null);
              setPreviewImage(null);
            }}
            onImageUpload={handleImageUpload}
            previewImage={previewImage}
          />
        )}
      </div>
    </div>
  );
};

// Componente para cada card de trabajo en el admin
interface WorkCardProps {
  work: PortfolioImage;
  onEdit: () => void;
  onDelete: () => void;
}

const WorkCard: React.FC<WorkCardProps> = ({ work, onEdit, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors duration-200">
      {/* Imagen */}
      <div className="relative aspect-[4/3] bg-[#0B0B0B]">
        <img
          src={work.src}
          alt={work.alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Overlay con acciones */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 bg-[#D4AF37] text-[#0B0B0B] rounded-lg hover:bg-[#F4D061] transition-colors duration-200"
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Badge de categoría */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-[#D4AF37] text-[#0B0B0B] text-xs font-medium rounded-full">
            {work.category}
          </span>
        </div>
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">{work.title}</h3>
        <p className="text-[#C7C7C7] text-sm mb-3">{work.caption}</p>

        {/* Metadatos */}
        <div className="flex items-center justify-between text-xs text-[#C7C7C7]">
          <span>
            {work.width} × {work.height}
          </span>
          <span
            className={`px-2 py-1 rounded ${
              work.priority ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-[#1A1A1A]"
            }`}
          >
            {work.priority ? "Prioridad" : "Normal"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Modal para formulario de trabajo
interface WorkFormModalProps {
  work: PortfolioImage | null;
  onSave: (work: Partial<PortfolioImage>) => void;
  onClose: () => void;
  onImageUpload: (file: File) => Promise<string>;
  previewImage: string | null;
}

const WorkFormModal: React.FC<WorkFormModalProps> = ({
  work,
  onSave,
  onClose,
  onImageUpload,
  previewImage,
}) => {
  const [formData, setFormData] = useState({
    title: work?.title || "",
    caption: work?.caption || "",
    category: work?.category || "Cortes",
    alt: work?.alt || "",
    priority: work?.priority || false,
    src: work?.src || "",
    width: work?.width || 1600,
    height: work?.height || 1600,
  });

  const categories = [
    "Cortes",
    "Barbas",
    "Afeitados",
    "Servicios Premium",
    "Cortes Especializados",
    "Trabajos Artísticos",
  ];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageUrl = await onImageUpload(file);
        setFormData((prev) => ({ ...prev, src: imageUrl }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const workData: Partial<PortfolioImage> = {
      ...formData,
      id: work?.id || `work-${Date.now()}`,
      palette: work?.palette || ["#0B0B0B", "#D4AF37", "#1A1A1A"],
    };

    onSave(workData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0B0B]/80 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#D4AF37]">
            {work ? "Editar Trabajo" : "Agregar Trabajo"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-[#C7C7C7] hover:text-white transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload de imagen */}
          <div>
            <label className="block text-sm font-medium text-[#C7C7C7] mb-2">
              Imagen
            </label>
            <div className="border-2 border-dashed border-[#D4AF37]/30 rounded-xl p-6 text-center">
              {previewImage || formData.src ? (
                <div className="relative">
                  <img
                    src={previewImage || formData.src}
                    alt="Preview"
                    className="max-w-full h-48 object-cover mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("imageInput")?.click()
                    }
                    className="mt-3 text-sm text-[#D4AF37] hover:text-[#F4D061]"
                  >
                    Cambiar imagen
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                  <p className="text-[#C7C7C7] mb-2">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("imageInput")?.click()
                    }
                    className="text-[#D4AF37] hover:text-[#F4D061] font-medium"
                  >
                    Seleccionar archivo
                  </button>
                </div>
              )}
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-[#C7C7C7] mb-2">
                Título
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-[#C7C7C7] mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-[#C7C7C7] mb-2">
              Descripción
            </label>
            <textarea
              value={formData.caption}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, caption: e.target.value }))
              }
              rows={3}
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Alt text */}
          <div>
            <label className="block text-sm font-medium text-[#C7C7C7] mb-2">
              Texto alternativo (SEO)
            </label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, alt: e.target.value }))
              }
              className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
              placeholder="Descripción de la imagen para accesibilidad"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dimensiones */}
            <div>
              <label className="block text-sm font-medium text-[#C7C7C7] mb-2">
                Ancho (px)
              </label>
              <input
                type="number"
                value={formData.width}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    width: parseInt(e.target.value),
                  }))
                }
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#C7C7C7] mb-2">
                Alto (px)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    height: parseInt(e.target.value),
                  }))
                }
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Prioridad */}
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="priority"
                checked={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-[#D4AF37] bg-[#0B0B0B] border-[#D4AF37]/20 rounded focus:ring-[#D4AF37]"
              />
              <label htmlFor="priority" className="ml-2 text-sm text-[#C7C7C7]">
                Imagen prioritaria
              </label>
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-[#D4AF37]/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-[#C7C7C7] hover:text-white transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-[#D4AF37] text-[#0B0B0B] px-6 py-2 rounded-lg font-semibold hover:bg-[#F4D061] transition-colors duration-200"
            >
              <Save className="w-4 h-4" />
              <span>{work ? "Actualizar" : "Guardar"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortfolioManager;
