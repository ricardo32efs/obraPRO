import { Component } from 'react'

/**
 * Evita pantalla en blanco ante errores de render en producción.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[Obra Pro]', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="flex min-h-svh flex-col items-center justify-center gap-4 bg-[#faf8f5] px-6 py-12 text-center text-[#1a1a1a]"
        >
          <p className="font-display text-xl font-bold">Algo salió mal</p>
          <p className="max-w-md text-sm text-[#5c534a]">
            Podés recargar la página. Si el problema sigue, probá limpiar los datos del sitio en la configuración del
            navegador (esto borra presupuestos guardados solo en este dispositivo).
          </p>
          <button
            type="button"
            className="rounded-xl bg-[#c1440e] px-5 py-2.5 text-sm font-semibold text-white"
            onClick={() => window.location.reload()}
          >
            Recargar Obra Pro
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
