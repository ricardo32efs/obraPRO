/**
 * Términos y Condiciones de Obra Pro
 * Cobertura legal básica para Argentina (Ley 25.326, Ley 24.240)
 */
export function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-[var(--color-text)]">
      <h1 className="font-display text-3xl font-bold">Términos y Condiciones</h1>
      <p className="mt-2 text-sm text-[var(--color-text-2)]">
        Última actualización: 21 de abril de 2026
      </p>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">1. Objeto del Servicio</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Obra Pro es una aplicación web que permite a profesionales de la construcción (albañiles, 
          electricistas, plomeros, etc.) crear, gestionar y exportar presupuestos de obra. La app 
          incluye una funcionalidad de asistente IA que sugiere materiales y mano de obra basándose 
          en descripciones de proyectos.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          <strong>Importante:</strong> Obra Pro es una herramienta de productividad. Los precios 
          sugeridos por la IA son referenciales y orientativos. El usuario es responsable de 
          verificar precios actuales con proveedores locales antes de cotizar a sus clientes.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">2. Almacenamiento de Datos</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Los presupuestos, datos de clientes y configuración de la empresa se almacenan 
          <strong> localmente en el dispositivo del usuario</strong> mediante la tecnología 
          localStorage del navegador. Esto significa:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-[var(--color-text-2)]">
          <li>Obra Pro no almacena tus datos en servidores propios</li>
          <li>Los datos están vinculados al navegador y dispositivo específico</li>
          <li>Si cambiás de dispositivo o borrás datos del navegador, perdés la información</li>
          <li>Es responsabilidad del usuario hacer backup (exportar PDF/Excel)</li>
        </ul>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Al usar la app, aceptás que Obra Pro no se responsabiliza por pérdida de datos 
          debido a borrado accidental, cambio de dispositivo, o fallas del navegador.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">3. Protección de Datos Personales (Ley 25.326)</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Los datos de tus clientes (nombres, direcciones, teléfonos, emails) que ingresás en 
          los presupuestos son de tu responsabilidad. Obra Pro:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-[var(--color-text-2)]">
          <li>No comparte estos datos con terceros</li>
          <li>No los usa para marketing</li>
          <li>No los transfiere fuera de tu dispositivo</li>
        </ul>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Recomendamos informar a tus clientes que sus datos se almacenan en tu dispositivo 
          y obtener su consentimiento conforme a la Ley 25.326 de Protección de Datos Personales.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">4. Suscripción PRO</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          La versión PRO ofrece funcionalidades adicionales como uso ilimitado del asistente IA, 
          exportación avanzada y soporte prioritario. Los pagos se procesan a través de 
          <strong> Mercado Pago</strong>, plataforma segura de terceros.
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-[var(--color-text-2)]">
          <li>La suscripción es por tiempo indefinido hasta que el usuario cancele</li>
          <li>Los precios pueden ajustarse con previo aviso de 30 días</li>
          <li>No se realizan reembolsos parciales por meses no utilizados</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">5. Derecho de Arrepentimiento (Ley 24.240)</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          De acuerdo con la Ley de Defensa del Consumidor N° 24.240, los usuarios tienen 
          <strong> 10 (diez) días corridos</strong> desde la contratación para ejercer el derecho 
          de arrepentimiento y solicitar la devolución del dinero, sin necesidad de explicar 
          motivos.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Para ejercer este derecho, contactanos a <strong>obrapro2026@gmail.com</strong> dentro 
          del plazo indicado. El reembolso se procesa en un máximo de 30 días hábiles.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">6. Limitación de Responsabilidad</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Obra Pro se proporciona "tal cual" sin garantías de ningún tipo. Específicamente:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-[var(--color-text-2)]">
          <li>No garantizamos que la app esté libre de errores o bugs</li>
          <li>No garantizamos la disponibilidad 24/7 del servicio</li>
          <li>Los precios de materiales sugeridos por IA pueden no reflejar el mercado actual</li>
          <li>La app no reemplaza asesoramiento profesional de contadores, abogados o ingenieros</li>
        </ul>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Obra Pro no se responsabiliza por pérdidas económicas, daños a la reputación, o 
          conflictos con terceros derivados del uso de la aplicación.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">7. Propiedad Intelectual</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Todos los derechos de propiedad intelectual sobre Obra Pro (código, diseño, logos, 
          funcionalidades) son propiedad exclusiva de los creadores. El usuario no puede:
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-[var(--color-text-2)]">
          <li>Copiar, modificar, o distribuir el código fuente</li>
          <li>Realizar ingeniería inversa</li>
          <li>Usar la app para actividades ilegales</li>
          <li>Intentar acceder a datos de otros usuarios</li>
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">8. Modificaciones</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Obra Pro se reserva el derecho de modificar estos términos en cualquier momento. 
          Los cambios significativos serán notificados por email a los usuarios registrados 
          o mediante aviso en la aplicación con 15 días de anticipación.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">9. Ley Aplicable</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa 
          será sometida a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, 
          con renuncia a cualquier otro fuero.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-xl font-semibold">10. Contacto</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-2)]">
          Para consultas sobre estos términos, ejercer derechos de arrepentimiento, o 
          cualquier otra cuestión legal, contactanos a:
        </p>
        <p className="mt-2 font-semibold text-[var(--color-text)]">
          📧 obrapro2026@gmail.com
        </p>
      </section>

      <div className="mt-10 text-center">
        <a
          href="/"
          className="inline-block rounded-lg bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
