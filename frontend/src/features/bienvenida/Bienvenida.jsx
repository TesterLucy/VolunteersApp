import { useNavigate } from 'react-router-dom'

export default function Bienvenida() {
  const navigate = useNavigate()

  return (
    <div className="welcome-container">
      <h1>Bienvenido</h1>
      <p>
        ¡Bienvenido a nuestra comunidad! Nos alegra mucho tenerte aquí. Juntos, podemos hacer
        grandes cosas. Explora las oportunidades de voluntariado y elige la que más te inspire.
        ¡Estamos emocionados de que formes parte de este viaje!
      </p>

      <div className="button-group">
        <button id="registerButton" onClick={() => navigate('/register')}>
          Registrar
        </button>
        <button id="loginButton" onClick={() => navigate('/login')}>
          Ingresar
        </button>
      </div>
    </div>
  )
}
