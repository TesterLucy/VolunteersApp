import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '../../shared/lib/supabaseClient'

export default function Mapa() {
  const navigate = useNavigate()
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    if (mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current).setView([4.611, -74.08175], 12)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map)

    function addMarkers(locations, className) {
      locations.forEach((location) => {
        const marker = L.marker([location.lat, location.lng], {
          icon: L.divIcon({
            className,
            iconSize: [25, 41],
          }),
        }).addTo(map)

        marker.on('click', () => {
          navigate(`/voluntariados/detalles?id=${location.id}`)
        })
      })
    }

    supabase
      .from('voluntariados')
      .select('id, lat, lng')
      .eq('type', 'normal')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al cargar los datos de voluntariado:', error)
        } else {
          addMarkers(data, 'marker-normal')
        }
      })

    supabase
      .from('voluntariados')
      .select('id, lat, lng')
      .eq('type', 'experience')
      .then(({ data, error }) => {
        if (error) {
          console.error('Error al cargar los datos de voluntariado:', error)
        } else {
          addMarkers(data, 'marker-experience')
        }
      })

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [navigate])

  return <div id="map" ref={mapContainerRef}></div>
}
