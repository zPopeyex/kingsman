import React, { useEffect, useState } from "react";

interface SafeBlendModesProps {
  children: React.ReactNode;
  fallbackClassName?: string;
}

const SafeBlendModes: React.FC<SafeBlendModesProps> = ({
  children,
  fallbackClassName = "",
}) => {
  const [supportsBlendModes, setSupportsBlendModes] = useState(true);
  const [supportsBackdrop, setSupportsBackdrop] = useState(true);

  useEffect(() => {
    // Detectar soporte para mix-blend-mode
    const testBlend = document.createElement("div");
    testBlend.style.mixBlendMode = "multiply";
    setSupportsBlendModes(testBlend.style.mixBlendMode === "multiply");

    // Detectar soporte para backdrop-filter
    const testBackdrop = document.createElement("div");
    testBackdrop.style.backdropFilter = "blur(10px)";
    setSupportsBackdrop(testBackdrop.style.backdropFilter === "blur(10px)");
  }, []);

  // Context value para componentes hijos
  const contextValue = {
    supportsBlendModes,
    supportsBackdrop,
    getBlendClass: (blendClass: string, fallback: string = "") =>
      supportsBlendModes ? blendClass : fallback,
    getBackdropClass: (backdropClass: string, fallback: string = "") =>
      supportsBackdrop ? backdropClass : fallback,
  };

  return (
    <div
      className={`${
        !supportsBlendModes || !supportsBackdrop ? fallbackClassName : ""
      }`}
      data-blend-support={supportsBlendModes}
      data-backdrop-support={supportsBackdrop}
    >
      <SafeBlendContext.Provider value={contextValue}>
        {children}
      </SafeBlendContext.Provider>
    </div>
  );
};

// Context para usar en componentes
const SafeBlendContext = React.createContext({
  supportsBlendModes: true,
  supportsBackdrop: true,
  getBlendClass: (blendClass: string, _fallback: string = "") => blendClass,
  getBackdropClass: (backdropClass: string, _fallback: string = "") =>
    backdropClass,
});

export const useSafeBlend = () => React.useContext(SafeBlendContext);
export default SafeBlendModes;
