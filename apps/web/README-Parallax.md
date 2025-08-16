# Kingsman Barber — Guía de Parallax / Animaciones

Esta guía documenta cómo está montada la landing parallax (GSAP + ScrollTrigger + Three.js), cómo respetar accesibilidad, y los presupuestos de rendimiento.

---

## 1) Arquitectura rápida

- **GSAP + ScrollTrigger**: utilidades en `src/lib/scroll.ts` registran el plugin y exportan helpers con defaults (`scrub: 0.8–1.6`, `anticipatePin: 1`).
- **Capas Parallax**: componente `src/sections/ParallaxLayers.tsx` acepta capas con `data-depth` mapeadas a velocidades **20/50/80**.
- **Objeto 3D**: `src/three/Object3D.tsx` (Three.js) con fallback de imagen en mobile o cuando `prefers-reduced-motion: reduce`/`data-animations="off"`.
- **Toggle global**: `AnimationsToggle` coloca `data-animations="on|off"` en `<html>` y emite `kb-animations-toggle`. Todos los módulos deben escucharlo.
- **Cursor dorado**: `GoldenCursor` sólo en puntero fino. No se monta en táctil/reduced.

---

## 2) Mapeo de velocidades (20/50/80)

> Se usa como “sensación de profundidad”. Más “profundo”, menor desplazamiento.

| Profundidad | `data-depth` | ΔY relativo en scroll | Uso típico                    |
| ----------- | ------------ | --------------------- | ----------------------------- |
| 20%         | `0.2`        | lento                 | Fondo / glow / textura mural  |
| 50%         | `0.5`        | medio                 | Objetos medios / titulares    |
| 80%         | `0.8`        | rápido                | Primer plano / CTA / detalles |

**Ejemplo en JSX:**

```tsx
<li data-depth="0.2" className="will-change-transform">…</li>
<li data-depth="0.5" className="will-change-transform">…</li>
<li data-depth="0.8" className="will-change-transform">…</li>
```
