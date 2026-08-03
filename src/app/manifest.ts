import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SeguimientoPro',
    short_name: 'SeguiPro',
    description: 'Gestión de cobros y ventas a crédito para emprendedores',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: '#2563FF',
    icons: [
      {
        src: '/icon',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
