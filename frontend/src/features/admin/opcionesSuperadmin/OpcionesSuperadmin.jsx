import { useNavigate } from 'react-router-dom'

export default function OpcionesSuperadmin() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="voluntariado-container">
      <h1>SuperAdmin Menu</h1>
      <p id="p">Explora las diferentes que ofrecemos.</p>

      <div className="button-group">
        <button
          id="EditVolunteerButton"
          onClick={() => navigate('/admin/editar-voluntariado-general')}
        >
          Editar Voluntariados
        </button>
        <button
          id="EditVolunterButton"
          onClick={() => navigate('/admin/editar-voluntarios-general')}
        >
          Editar Voluntarios
        </button>
        <button id="logoutButton" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
