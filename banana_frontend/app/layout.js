import Navbar from '@/components/Navbar'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import Provider from './provider'
import Footer from '@/components/Footer'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Banana Study',
  description: 'Manage and Conquer',
}

export default function RootLayout({ children }) {

  return (

    <html lang="en">
      <body className={inter.className}>

        <Provider>
          <Navbar />
          {children}
          <Footer />
        </Provider>

      </body>
    </html>
  )
}
