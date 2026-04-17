import { useEffect } from 'react'
import { hasValidLicense } from '../utils/licenseUtils'

/**
 * Plan almacenado en localStorage: "free" | "pro"
 * Al iniciar, si el plan quedó en "free" pero hay una licencia válida guardada,
 * se restaura PRO automáticamente (evita pérdida de acceso por limpieza de localStorage).
 */
export function usePlan(plan, setPlan) {
  const isPro = plan === 'pro'

  useEffect(() => {
    if (plan !== 'pro' && hasValidLicense()) {
      setPlan('pro')
    }
  // Solo en mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isPro }
}
