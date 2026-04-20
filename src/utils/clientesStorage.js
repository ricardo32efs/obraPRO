const KEY = 'obrapro_clientes_v1'

export function getClientes() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveCliente(cliente) {
  const list = getClientes()
  const existing = list.findIndex((c) => c.id === cliente.id)
  if (existing >= 0) {
    list[existing] = { ...list[existing], ...cliente, updatedAt: new Date().toISOString() }
  } else {
    list.unshift({ ...cliente, id: cliente.id || crypto.randomUUID(), createdAt: new Date().toISOString() })
  }
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
  return list
}

export function deleteCliente(id) {
  const list = getClientes().filter((c) => c.id !== id)
  try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {}
  return list
}

export function upsertClienteFromForm({ clienteNombre, clienteTelefono, clienteEmail }) {
  if (!clienteNombre?.trim()) return
  const list = getClientes()
  const existing = list.find(
    (c) => c.nombre.trim().toLowerCase() === clienteNombre.trim().toLowerCase()
  )
  if (existing) {
    saveCliente({ ...existing, telefono: clienteTelefono || existing.telefono, email: clienteEmail || existing.email })
  } else {
    saveCliente({ id: crypto.randomUUID(), nombre: clienteNombre.trim(), telefono: clienteTelefono || '', email: clienteEmail || '' })
  }
}
