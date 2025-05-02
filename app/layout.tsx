import './styles/globals.css'
import { Inter } from 'next/font/google'
import { NavBarDemo } from "./components/ui/tubelight-navbar-demo"

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen overflow-x-hidden">
        <NavBarDemo />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
