import { useEffect, useState } from 'react'

interface ThreeResponsiveOptions {
  breakpoint?: number
  reducedMotionCheck?: boolean
}

interface ThreeResponsiveState {
  shouldRender: boolean
  devicePixelRatio: number
  isReducedMotion: boolean
  isMobile: boolean
}

export const useThreeResponsive = (options: ThreeResponsiveOptions = {}): ThreeResponsiveState => {
  const { breakpoint = 768, reducedMotionCheck = true } = options
  
  const [state, setState] = useState<ThreeResponsiveState>({
    shouldRender: false,
    devicePixelRatio: 1,
    isReducedMotion: false,
    isMobile: true
  })

  useEffect(() => {
    const updateState = () => {
      const width = window.innerWidth
      const isMobile = width < breakpoint
      
      // Verificar prefers-reduced-motion
      const isReducedMotion = reducedMotionCheck && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Determinar si debe renderizar 3D
      const shouldRender = !isMobile && !isReducedMotion

      // DPR optimizado para performance
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)

      setState({
        shouldRender,
        devicePixelRatio,
        isReducedMotion,
        isMobile
      })
    }

    // Inicializar
    updateState()

    // Listeners para cambios
    const resizeHandler = () => {
      // Debounce para evitar múltiples llamadas
      clearTimeout(window.resizeTimeout)
      window.resizeTimeout = setTimeout(updateState, 250)
    }

    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)')
    const motionHandler = () => updateState()

    // Event listeners
    window.addEventListener('resize', resizeHandler)
    if (reducedMotionCheck) {
      mediaQueryList.addEventListener('change', motionHandler)
    }

    // Pausar cuando tab no es visible
    const visibilityHandler = () => {
      setState(prev => ({
        ...prev,
        shouldRender: prev.shouldRender && !document.hidden
      }))
    }

    document.addEventListener('visibilitychange', visibilityHandler)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeHandler)
      if (reducedMotionCheck) {
        mediaQueryList.removeEventListener('change', motionHandler)
      }
      document.removeEventListener('visibilitychange', visibilityHandler)
      clearTimeout(window.resizeTimeout)
    }
  }, [breakpoint, reducedMotionCheck])

  return state
}

// Extender Window interface para TypeScript
declare global {
  interface Window {
    resizeTimeout: ReturnType<typeof setTimeout>
  }
}