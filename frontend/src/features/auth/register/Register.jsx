import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../shared/lib/supabaseClient'

const initialFormData = {
  username: '',
  email: '',
  password: '',
  cedula: '',
  birthdate: '',
}

function isAdult(birthdateValue) {
  const birthdate = new Date(birthdateValue)
  const today = new Date()
  const age = today.getFullYear() - birthdate.getFullYear()
  const monthDifference = today.getMonth() - birthdate.getMonth()
  const dayDifference = today.getDate() - birthdate.getDate()

  if (age < 18 || (age === 18 && (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)))) {
    return false
  }
  return true
}

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (event) => {
    const { id, value } = event.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAdult(formData.birthdate)) {
      alert('Debes ser mayor de 18 años para registrarte.')
      return
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          cedula: formData.cedula,
          birthdate: formData.birthdate,
        },
      },
    })

    if (error) {
      alert(error.message)
      return
    }

    alert('Registro exitoso. Ahora puedes iniciar sesión.')
    navigate('/login')
  }

  const handleCancel = () => {
    setFormData(initialFormData)
    navigate('/')
  }

  return (
    <div className="container">
      <h2>Registro</h2>
      <form id="registerForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Usuario:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="cedula">Cédula:</label>
          <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="birthdate">Fecha de Nacimiento:</label>
          <input type="date" id="birthdate" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
        </div>
        <div className="button-group">
          <button type="submit">Registrar</button>
          <button type="button" className="cancel-button" id="cancelButton" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
