// web/apps/src/components/admin/PortfolioManager.tsx
import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  Download,
  AlertCircle,
} from "lucide-react";
import type { PortfolioImage, PortfolioCategory } from "../../types/portfolio";
import {
  loadPortfolioFromFirebase,
  savePortfolioToFirebase,
  uploadImageToFirebase,
} from "@/services/firebase-portfolio";
// TODO: Usar el servicio global cuando esté implementado
// import { usePortfolio } from '../services/portfolioService';

interface PortfolioManagerProps {
  // Props para integración con tu sistema de datos
}

const PortfolioManager: React.FC<PortfolioManagerProps> = () => {
  const [works, setWorks] = useState<PortfolioImage[]>([]);
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [editingWork, setEditingWork] = useState<PortfolioImage | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Cargar trabajos existentes
  useEffect(() => {
    loadPortfolioWorks();
  }, []);

  const loadPortfolioWorks = async () => {
    try {
      setLoading(true);

      // TODO: Uncomment to use Firebase
      // import { loadPortfolioFromFirebase } from '../services/firebase-portfolio';
      const data = await loadPortfolioFromFirebase();
      setWorks(data);

      // Fallback: cargar desde el archivo JSON local
      const response = await fetch("/src/data/portafolio.json");
      if (response.ok) {
        const data = await response.json();
        setWorks(Array.isArray(data) ? data : []);
      } else {
        console.warn("No se pudo cargar portafolio.json");
        setWorks([]);
      }
    } catch (error) {
      console.error("Error loading portfolio works:", error);
      // Fallback a datos vacíos
      setWorks([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar cambios con Firebase + fallback
  const saveAllChanges = async () => {
    setSaving(true);

    try {
      // TODO: Uncomment to use Firebase
      // import { savePortfolioToFirebase } from '../services/firebase-portfolio';
      try {
        await savePortfolioToFirebase(works);
        setHasChanges(false);
        alert("Cambios guardados en Firebase exitosamente!");
        return;
      } catch (firebaseError) {
        console.log("Firebase falló, usando fallback:", firebaseError);
        // Continúa con el fallback
      }

      // Guardar en localStorage como backup
      try {
        localStorage.setItem(
          "kingsman_portfolio_backup",
          JSON.stringify(works)
        );
        console.log("Portfolio guardado en localStorage como backup");
      } catch (error) {
        console.warn("No se pudo guardar en localStorage:", error);
      }

      // Fallback: descargar archivo actualizado
      const dataStr = JSON.stringify(works, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "portafolio.generated.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setHasChanges(false);
      alert(
        "Archivo descargado. Reemplaza manualmente src/data/portafolio.json y haz commit."
      );

      // TODO: Notificar al servicio global de portfolio
      // portfolioService.updateWorks(works);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // TODO: Uncomment to use Firebase Storage
        // import { uploadImageToFirebase } from '../services/firebase-portfolio';
        const downloadURL = await uploadImageToFirebase(
          file,
          `work-${Date.now()}`
        );
        resolve(downloadURL);
        return;

        // Generar URL limpia para el archivo
        const cleanFileName = file.name
          .replace(/\s+/g, "-")
          .toLowerCase()
          .replace(/[^a-z0-9.-]/g, "");

        const fakeServerUrl = `/assets/images/portafolio/${cleanFileName}`;

        console.log("Imagen procesada:", {
          fileName: file.name,
          cleanFileName,
          size: file.size,
          type: file.type,
          url: fakeServerUrl,
        });

        resolve(fakeServerUrl);
      } catch (error) {
        console.error("Error en handleImageUpload:", error);
        reject(error);
      }
    });
  };

  const saveWork = async (workData: Partial<PortfolioImage>) => {
    try {
      if (workData.id && works.find((w) => w.id === workData.id)) {
        // Actualizar trabajo existente
        setWorks((prev) =>
          prev.map((work) =>
            work.id === workData.id
              ? ({ ...work, ...workData } as PortfolioImage)
              : work
          )
        );
      } else {
        // Agregar nuevo trabajo
        const newWork: PortfolioImage = {
          id: `work-${Date.now()}`,
          title: workData.title || "",
          caption: workData.caption || "",
          category: workData.category || "Cortes",
          src: workData.src || "",
          alt:
            workData.alt ||
            `${workData.title} - ${workData.category} en barbería Kingsman`,
          width: workData.width || 1600,
          height: workData.height || 1600,
          priority: workData.priority || false,
          palette: workData.palette || ["#0B0B0B", "#D4AF37", "#1A1A1A"],
        };
        setWorks((prev) => [...prev, newWork]);

        console.log("Nuevo trabajo agregado:", newWork);
      }

      setHasChanges(true);
      setIsAddingWork(false);
      setEditingWork(null);
      setPreviewImage(null);

      // Mostrar confirmación
      alert(
        workData.id
          ? "Trabajo actualizado correctamente"
          : "Trabajo agregado correctamente"
      );
    } catch (error) {
      console.error("Error saving work:", error);
      alert("Error al guardar el trabajo");
    }
  };

  const deleteWork = async (workId: string) => {
    if (!confirm("¿Estás seguro de eliminar este trabajo?")) return;

    try {
      setWorks((prev) => prev.filter((work) => work.id !== workId));
      setHasChanges(true);
    } catch (error) {
      console.error("Error deleting work:", error);
      alert("Error al eliminar el trabajo");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0B0B0B] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#C7C7C7]">Cargando portfolio...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex gap-3">
            {hasChanges && (
              <button
                onClick={saveAllChanges}
                disabled={saving}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Guardar Cambios</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={() => setIsAddingWork(true)}
              className="flex items-center space-x-2 bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 rounded-xl font-semibold hover:bg-[#F4D061] transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Trabajo</span>
            </button>
          </div>
        </div>

        {/* Alerta de cambios sin guardar */}
        {hasChanges && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <p className="text-yellow-200">
                Tienes cambios sin guardar. No olvides guardar antes de salir.
              </p>
            </div>
          </div>
        )}

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

        {/* Estado vacío */}
        {works.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay trabajos en el portfolio
            </h3>
            <p className="text-[#C7C7C7] mb-6">
              Comienza agregando tu primer trabajo para mostrar tu portafolio
            </p>
            <button
              onClick={() => setIsAddingWork(true)}
              className="bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 rounded-xl font-semibold hover:bg-[#F4D061] transition-colors duration-200"
            >
              Agregar Primer Trabajo
            </button>
          </div>
        )}

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

        {/* Badge de prioridad */}
        {work.priority && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              Prioridad
            </span>
          </div>
        )}
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1">{work.title}</h3>
        <p className="text-[#C7C7C7] text-sm mb-3 line-clamp-2">
          {work.caption}
        </p>

        {/* Metadatos */}
        <div className="flex items-center justify-between text-xs text-[#C7C7C7]">
          <span>
            {work.width} × {work.height}
          </span>
          <div className="flex gap-2">
            {work.palette.map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
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
  previewImage: externalPreviewImage,
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
    palette: work?.palette || ["#0B0B0B", "#D4AF37", "#1A1A1A"],
  });

  const [localPreviewImage, setLocalPreviewImage] = useState<string | null>(
    externalPreviewImage
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  const categories: PortfolioCategory[] = [
    "Cortes",
    "Barbas",
    "Tattos",
    "Afeitados",
    "Servicios Premium",
    "Cortes Especializados",
    "Trabajos Artísticos",
  ];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        console.log("Archivo seleccionado:", file.name, file.type, file.size);

        // Validar tipo de archivo
        if (!file.type.startsWith("image/")) {
          alert("Por favor selecciona un archivo de imagen válido");
          return;
        }

        // Validar tamaño (máximo 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert("La imagen es demasiado grande. Máximo 10MB");
          return;
        }

        // Crear preview local inmediatamente
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setLocalPreviewImage(result);
        };
        reader.readAsDataURL(file);

        const imageUrl = await onImageUpload(file);
        console.log("URL generada:", imageUrl);

        setFormData((prev) => ({
          ...prev,
          src: imageUrl,
          alt:
            prev.alt || `${prev.title} - ${prev.category} en barbería Kingsman`,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error al procesar la imagen");
      }
    }
  };

  const updatePaletteColor = (index: number, color: string) => {
    const newPalette = [...formData.palette];
    newPalette[index] = color;
    setFormData((prev) => ({ ...prev, palette: newPalette }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar si hay imagen (ya sea en formData.src o en localPreviewImage)
    if (!formData.src && !localPreviewImage) {
      alert("Por favor selecciona una imagen");
      return;
    }

    // Si tenemos preview local pero no URL final, usar el preview
    const finalSrc = formData.src || localPreviewImage || "";

    const workData: Partial<PortfolioImage> = {
      ...formData,
      src: finalSrc,
      id: work?.id || `work-${Date.now()}`,
    };

    console.log("Guardando trabajo con datos:", workData);
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
              Imagen *
            </label>
            <div className="border-2 border-dashed border-[#D4AF37]/30 rounded-xl p-6 text-center">
              {localPreviewImage || formData.src ? (
                <div className="relative">
                  <img
                    src={localPreviewImage || formData.src}
                    alt="Preview"
                    className="max-w-full h-48 object-cover mx-auto rounded-lg border border-[#D4AF37]/20"
                    onError={(e) => {
                      console.error("Error cargando imagen preview:", e);
                      setLocalPreviewImage(null);
                    }}
                  />
                  <div className="mt-3 space-y-2">
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById("imageInput")?.click()
                      }
                      className="text-sm text-[#D4AF37] hover:text-[#F4D061] block mx-auto"
                    >
                      Cambiar imagen
                    </button>
                    {formData.src && (
                      <p className="text-xs text-[#C7C7C7] break-all">
                        URL: {formData.src}
                      </p>
                    )}
                  </div>
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
                  <p className="text-xs text-[#C7C7C7] mt-2">
                    Formatos: JPG, PNG, WebP | Máximo: 10MB
                  </p>
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
                Título *
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
                Categoría *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                required
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
              placeholder="Descripción breve del trabajo realizado..."
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
                    width: parseInt(e.target.value) || 1600,
                  }))
                }
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                min="100"
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
                    height: parseInt(e.target.value) || 1600,
                  }))
                }
                className="w-full bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                min="100"
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

          {/* Paleta de colores */}
          <div>
            <label className="block text-sm font-medium text-[#C7C7C7] mb-2">
              Paleta de colores
            </label>
            <div className="flex gap-2">
              {formData.palette.map((color, index) => (
                <div key={index} className="flex-1">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updatePaletteColor(index, e.target.value)}
                    className="w-full h-10 rounded-lg border border-[#D4AF37]/20 bg-[#0B0B0B]"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updatePaletteColor(index, e.target.value)}
                    className="w-full mt-1 text-xs bg-[#0B0B0B] border border-[#D4AF37]/20 rounded px-2 py-1 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              ))}
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
              disabled={uploadingImage}
              className="flex items-center space-x-2 bg-[#D4AF37] text-[#0B0B0B] px-6 py-2 rounded-lg font-semibold hover:bg-[#F4D061] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
