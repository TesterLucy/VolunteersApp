import { useNavigate } from 'react-router-dom'

export default function NuevoVoluntariado() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="voluntariado-container">
      <h1>Oportunidades de Voluntariado</h1>
      <p id="p">
        Explora las diferentes oportunidades de voluntariado que ofrecemos. Puedes contribuir en
        las siguientes áreas:
      </p>

      <div className="button-group">
        <button id="normalVolunteerButton" onClick={() => navigate('/voluntariados/normal')}>
          Voluntariado Normal
        </button>
        <button
          id="experienceVolunteerButton"
          onClick={() => navigate('/voluntariados/experiencia')}
        >
          Voluntariado para Experiencia Laboral
        </button>
        <button id="logoutButton" onClick={handleLogout}>
          Cerrar Sesión
        </button>
        <button id="mapaButton" onClick={() => navigate('/mapa')}>
          Ubicacion
        </button>
      </div>
    </div>
  )
}
