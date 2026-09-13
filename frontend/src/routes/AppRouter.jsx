import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Bienvenida from '../features/bienvenida/Bienvenida'
import Login from '../features/auth/login/Login'
import Register from '../features/auth/register/Register'
import ForgotPassword from '../features/auth/forgotPassword/ForgotPassword'
import VerifyCode from '../features/auth/forgotPassword/VerifyCode'
import ResetPassword from '../features/auth/forgotPassword/ResetPassword'
import Mapa from '../features/mapa/Mapa'
import NuevoVoluntariado from '../features/voluntariados/nuevoVoluntariado/NuevoVoluntariado'
import VoluntariadoNormal from '../features/voluntariados/listado/VoluntariadoNormal'
import VoluntariadoExperiencia from '../features/voluntariados/listado/VoluntariadoExperiencia'
import DetalleVoluntariado from '../features/voluntariados/detalles/DetalleVoluntariado'
import Certificado from '../features/certificado/Certificado'
import OpcionesSuperadmin from '../features/admin/opcionesSuperadmin/OpcionesSuperadmin'
import EditarVoluntariadoGeneral from '../features/admin/editarVoluntariados/EditarVoluntariadoGeneral'
import EditarVoluntariosGeneral from '../features/admin/editarVoluntarios/EditarVoluntariosGeneral'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/voluntariados/nuevo" element={<NuevoVoluntariado />} />
        <Route path="/voluntariados/normal" element={<VoluntariadoNormal />} />
        <Route path="/voluntariados/experiencia" element={<VoluntariadoExperiencia />} />
        <Route path="/voluntariados/detalles" element={<DetalleVoluntariado />} />
        <Route path="/certificado" element={<Certificado />} />
        <Route path="/admin/opciones-superadmin" element={<OpcionesSuperadmin />} />
        <Route
          path="/admin/editar-voluntariado-general"
          element={<EditarVoluntariadoGeneral />}
        />
        <Route
          path="/admin/editar-voluntarios-general"
          element={<EditarVoluntariosGeneral />}
        />
      </Routes>
    </BrowserRouter>
  )
}
