import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabaseClient'

export default function VoluntariadoNormal() {
  const navigate = useNavigate()
  const [voluntarios, setVoluntarios] = useState([])

  useEffect(() => {
    supabase
      .from('voluntariados')
      .select('id, summary, description')
      .eq('type', 'normal')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al cargar los datos de voluntariados:', error)
        } else {
          setVoluntarios(data)
        }
      })
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="container">
      <h2>VOLUNTARIOS</h2>

      <div className="voluntarios-lista" id="voluntarios-lista">
        {voluntarios.map((voluntario) => (
          <div
            key={voluntario.id}
            className="voluntario"
            onClick={() => navigate(`/voluntariados/detalles?id=${voluntario.id}`)}
          >
            <h3>Voluntariado #{voluntario.id}</h3>
            <p>{voluntario.summary}</p>
          </div>
        ))}
      </div>

      <button id="logoutButton" onClick={handleLogout}>
        Cerrar Sesión
      </button>

      <button id="salirButton" onClick={() => navigate('/voluntariados/nuevo')}>
        SALIR
      </button>
    </div>
  )
}
