import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabaseClient'

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateEmail(email)) {
      alert('Por favor, introduce un correo electrónico válido.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      alert(error.message)
      return
    }

    alert('Se ha enviado un correo de recuperación con el código a ' + email)
    localStorage.setItem('resetEmail', email)
    navigate('/verify-code')
  }

  return (
    <div className="container">
      <h2>Recuperar Contraseña</h2>
      <form id="forgotPasswordForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Introduce tu correo electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Enviar correo de recuperación</button>
          <button
            type="button"
            className="cancel-button"
            id="cancelButton"
            onClick={() => navigate('/login')}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
