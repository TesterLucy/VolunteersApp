import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabaseClient'

export default function VerifyCode() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: localStorage.getItem('resetEmail') || '',
    code: '',
  })

  const handleChange = (event) => {
    const { id, value } = event.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { error } = await supabase.auth.verifyOtp({
      email: formData.email,
      token: formData.code,
      type: 'recovery',
    })

    if (error) {
      alert('El código ingresado no es válido o ha expirado.')
      return
    }

    alert('Código verificado correctamente. Ahora puedes cambiar tu contraseña.')
    navigate('/reset-password')
  }

  return (
    <div className="container">
      <h1>Verificar Código</h1>
      <form id="verifyCodeForm" onSubmit={handleSubmit}>
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
            type="text"
            id="code"
            placeholder="Ingresa tu código"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Verificar código</button>
        </div>
      </form>
    </div>
  )
}
