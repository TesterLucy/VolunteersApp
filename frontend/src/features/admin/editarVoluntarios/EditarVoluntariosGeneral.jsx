import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabaseClient'

export default function EditarVoluntariosGeneral() {
  const navigate = useNavigate()
  const [voluntarios, setVoluntarios] = useState([])
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ email: '', cedula: '', birthdate: '' })

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, username, email, cedula, birthdate, role')
      .eq('role', 'voluntario')
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          console.error(fetchError)
          setError('Error al cargar la lista de voluntarios')
        } else {
          setVoluntarios(data)
        }
      })
  }, [])

  const handleEditar = (voluntario) => {
    setEditingId(voluntario.id)
    setEditForm({
      email: voluntario.email,
      cedula: voluntario.cedula,
      birthdate: voluntario.birthdate,
    })
  }

  const handleFormChange = (event) => {
    const { id, value } = event.target
    const field = id.replace('edit', '').toLowerCase()
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleGuardar = async (event) => {
    event.preventDefault()

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        email: editForm.email,
        cedula: editForm.cedula,
        birthdate: editForm.birthdate,
      })
      .eq('id', editingId)

    if (updateError) {
      console.error('Error al actualizar el usuario:', updateError)
      return
    }

    alert('Datos actualizados con éxito')
    window.location.reload()
  }

  const handleCancelar = () => {
    setEditingId(null)
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="container">
      <h2>VOLUNTARIOS</h2>

      <div id="voluntarios-lista">
        {error && <p>{error}</p>}
        {voluntarios.map((voluntario) => (
          <div className="voluntario" key={voluntario.id}>
            <h3>{voluntario.username}</h3>
            <p>Email: {voluntario.email}</p>
            <p>Cédula: {voluntario.cedula}</p>
            <p>Fecha de nacimiento: {voluntario.birthdate}</p>
            <button className="editar-button" onClick={() => handleEditar(voluntario)}>
              Editar
            </button>
          </div>
        ))}
      </div>

      <div id="editFormContainer" style={{ display: editingId ? 'block' : 'none' }}>
        <h3>Editar Voluntario</h3>
        <form id="editForm" onSubmit={handleGuardar}>
          <label htmlFor="editUsername">Usuario:</label>
          <input
            type="text"
            id="editUsername"
            value={voluntarios.find((v) => v.id === editingId)?.username || ''}
            disabled
          />

          <label htmlFor="editEmail">Email:</label>
          <input type="email" id="editEmail" value={editForm.email} onChange={handleFormChange} />

          <label htmlFor="editCedula">Cédula:</label>
          <input type="text" id="editCedula" value={editForm.cedula} onChange={handleFormChange} />

          <label htmlFor="editBirthdate">Fecha de Nacimiento:</label>
          <input
            type="date"
            id="editBirthdate"
            value={editForm.birthdate}
            onChange={handleFormChange}
          />

          <button type="submit" id="saveButton">
            Guardar
          </button>
          <button type="button" id="cancelButton" onClick={handleCancelar}>
            Cancelar
          </button>
        </form>
      </div>

      <button id="logoutButton" onClick={handleLogout}>
        Cerrar Sesión
      </button>
      <button id="salirButton" onClick={() => navigate('/voluntariados/normal')}>
        SALIR
      </button>
    </div>
  )
}
