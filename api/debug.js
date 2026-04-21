/**
 * Endpoint de diagnóstico - NO usar en producción permanentemente
 * Muestra estado de variables sin revelar valores completos
 */
export default async function handler(req, res) {
  const vars = {
    EMAILJS_SERVICE_ID: process.env.EMAILJS_SERVICE_ID ? '✅ Configurado (' + process.env.EMAILJS_SERVICE_ID.substring(0, 8) + '...)' : '❌ FALTA',
    EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID ? '✅ Configurado (' + process.env.EMAILJS_TEMPLATE_ID.substring(0, 8) + '...)' : '❌ FALTA',
    EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY ? '✅ Configurado (' + process.env.EMAILJS_PUBLIC_KEY.substring(0, 8) + '...)' : '❌ FALTA',
    EMAILJS_PRIVATE_KEY: process.env.EMAILJS_PRIVATE_KEY ? '✅ Configurado' : '❌ FALTA',
    EMAIL_TO: process.env.EMAIL_TO ? '✅ Configurado (' + process.env.EMAIL_TO + ')' : '❌ FALTA',
  }

  const allOk = Object.values(vars).every(v => v.includes('✅'))

  res.status(200).json({
    allConfigured: allOk,
    variables: vars,
    nodeEnv: process.env.NODE_ENV,
    tip: allOk ? 'Todas las variables están OK. El problema es otro.' : 'Faltan variables. Configurar en Vercel → Settings → Environment Variables'
  })
}
