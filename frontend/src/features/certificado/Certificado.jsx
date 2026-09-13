import { useEffect, useState } from 'react'
import './certificado.css'

export default function Certificado() {
  const [volunteerName, setVolunteerName] = useState('[Nombre del Voluntario]')
  const [volunteerType, setVolunteerType] = useState('[Tipo de Voluntariado]')
  const [issueDate, setIssueDate] = useState('[Fecha]')

  useEffect(() => {
    const name = prompt('Por favor, ingresa tu nombre completo:')
    const type = prompt('¿Qué tipo de voluntariado realizaste?')
    const date = new Date().toLocaleDateString()

    if (!name || !type) {
      alert('No se ingresaron todos los datos. Por favor, recarga la página e intenta de nuevo.')
      return
    }

    setVolunteerName(name)
    setVolunteerType(type)
    setIssueDate(date)

    alert('¡Certificado generado con éxito!')
  }, [])

  return (
    <div className="certificate-container">
      <div className="certificate-border">
        <div className="certificate-content">
          <h1>Certificado de Reconocimiento</h1>
          <p className="subheading">Otorgado a</p>
          <h2 id="volunteerName">{volunteerName}</h2>
          <p className="description">
            En reconocimiento a su destacada participación y compromiso en el programa de
            voluntariado de tipo <span id="volunteerType">{volunteerType}</span>.
          </p>
          <p className="footer">
            Emitido el <span id="issueDate">{issueDate}</span>
          </p>
          <div className="signature"></div>
        </div>
      </div>
    </div>
  )
}
