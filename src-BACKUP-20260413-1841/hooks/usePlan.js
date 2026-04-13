import { useCallback } from 'react'
import { LS_KEYS } from '../utils/constants'

/**
 * Plan almacenado en localStorage: "free" | "pro"
 */
export function usePlan(plan, setPlan) {
  const isPro = plan === 'pro'

  const activateProDemo = useCallback(() => {
    localStorage.setItem(LS_KEYS.plan, 'pro')
    setPlan('pro')
  }, [setPlan])

  return { isPro, activateProDemo }
}
