import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabaseClient'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: localStorage.getItem('resetEmail') || '',
    newPassword: '',
  })

  const handleChange = (event) => {
    const { id, value } = event.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { error } = await supabase.auth.updateUser({ password: formData.newPassword })

    if (error) {
      alert('Hubo un problema al cambiar la contraseña.')
      return
    }

    localStorage.removeItem('resetEmail')
    await supabase.auth.signOut()

    alert('Contraseña cambiada con éxito. Ahora puedes iniciar sesión.')
    navigate('/login')
  }

  return (
    <div className="container">
      <h1>Cambiar Contraseña</h1>
      <form id="resetPasswordForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Correo"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="newPassword"
            placeholder="Nueva contraseña"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Cambiar contraseña</button>
        </div>
      </form>
    </div>
  )
}
