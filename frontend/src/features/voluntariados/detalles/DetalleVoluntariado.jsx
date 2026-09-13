import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabaseClient'

export default function DetalleVoluntariado() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const volunteerId = searchParams.get('id')
  const [description, setDescription] = useState('Cargando descripción...')

  useEffect(() => {
    if (volunteerId === null || isNaN(volunteerId) || parseInt(volunteerId, 10) < 1) {
      setDescription('ID de voluntariado no válido.')
      return
    }

    supabase
      .from('voluntariados')
      .select('description')
      .eq('id', volunteerId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setDescription('Detalles no encontrados.')
        } else {
          setDescription(data.description)
        }
      })
  }, [volunteerId])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const handleAccept = () => {
    localStorage.clear()
    navigate('/certificado') // TODO: feature certificados, se migrará después
  }

  const handleReject = () => {
    // TODO: no implementado en el backend/frontend original (sin lógica real)
  }

  return (
    <div className="container">
      <h1>Detalles del Voluntariado</h1>
      <p id="description">{description}</p>

      <div className="button-group">
        <button id="acceptButton" onClick={handleAccept}>
          Aceptar
        </button>
        <button id="rejectButton" onClick={handleReject}>
          Rechazar
        </button>
        <button id="backToMapButton" onClick={() => navigate('/mapa')}>
          Volver al Mapa
        </button>
        <button id="logoutButton" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
