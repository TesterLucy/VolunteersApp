import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabaseClient'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    const { id, value } = event.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error || !data.user) {
      alert('Usuario o contraseña incorrectos')
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profileError || !profile) {
      alert('No olvides registrarte')
      return
    }

    alert('Inicio de sesión exitoso')

    const userRole = profile.role ? profile.role.trim().toLowerCase() : ''
    localStorage.setItem('userRole', userRole)

    if (userRole === 'admin') {
      navigate('/admin/editar-voluntariado-general')
    } else if (userRole === 'superadmin') {
      navigate('/admin/opciones-superadmin')
    } else if (userRole === 'voluntario') {
      navigate('/voluntariados/nuevo')
    } else {
      alert('No olvides registrarte')
    }
  }

  const handleCancel = () => {
    setFormData({ email: '', password: '' })
    navigate('/')
  }

  const handleForgotPassword = () => {
    setFormData({ email: '', password: '' })
    navigate('/forgot-password')
  }

  return (
    <div className="container">
      <h2>Inicio de Sesión</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Iniciar Sesión</button>
          <button type="button" className="cancel-button" id="cancelButton" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <button type="button" id="forgotPasswordButton" onClick={handleForgotPassword}>
          Olvidé mi contraseña
        </button>
      </div>
    </div>
  )
}
