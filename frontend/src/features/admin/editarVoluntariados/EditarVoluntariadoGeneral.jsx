import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabaseClient'

function VoluntarioItem({ voluntario, onSave }) {
  const [editing, setEditing] = useState(false)
  const [summary, setSummary] = useState(voluntario.summary)
  const [description, setDescription] = useState(voluntario.description)
  const [location, setLocation] = useState(voluntario.location)

  const handleGuardar = async (event) => {
    event.preventDefault()

    const { error } = await supabase
      .from('voluntariados')
      .update({ summary, description, location })
      .eq('id', voluntario.id)

    if (error) {
      console.error('Error al actualizar el voluntario:', error)
    } else {
      setEditing(false)
    }
  }

  const handleCancelar = (event) => {
    event.preventDefault()
    setSummary(voluntario.summary)
    setDescription(voluntario.description)
    setLocation(voluntario.location)
    setEditing(false)
  }

  return (
    <div className="voluntario">
      {!editing ? (
        <div className="content">
          <h3>Voluntario #{voluntario.id}</h3>
          <p>{summary}</p>
          <p>{description}</p>
          <p>Ubicación: {location}</p>
          <button className="editar-button" onClick={() => setEditing(true)}>
            Editar
          </button>
        </div>
      ) : (
        <form style={{ display: 'flex' }}>
          <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
          <button className="save-button" onClick={handleGuardar}>
            Guardar
          </button>
          <button className="cancel-button" onClick={handleCancelar}>
            Cancelar
          </button>
        </form>
      )}
    </div>
  )
}

export default function EditarVoluntariadoGeneral() {
  const navigate = useNavigate()
  const [voluntarios, setVoluntarios] = useState([])

  useEffect(() => {
    supabase
      .from('voluntariados')
      .select('id, summary, description, type, location, lat, lng')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al cargar los datos de voluntarios:', error)
        } else {
          setVoluntarios(data)
        }
      })
  }, [])

  return (
    <main>
      <section>
        <div className="voluntariado-container">
          <h1>Editar Voluntariados</h1>
          <div id="voluntarios-lista" className="voluntarios-lista">
            {voluntarios.map((voluntario) => (
              <VoluntarioItem key={voluntario.id} voluntario={voluntario} />
            ))}
          </div>
          <div className="button-group">
            <button id="salirButton" className="cancel-button" onClick={() => navigate('/')}>
              Salir
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
