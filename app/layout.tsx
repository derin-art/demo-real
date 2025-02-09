import { Layout } from '@/components/dom/Layout'
import { CartProvider } from '@/components/cart/cart-context'
import { getCart } from 'lib/modified-queries'
import { cookies } from 'next/headers'
import { Navbar } from '@/components/layout/navbar'
import WrapperWithContext from '@/components/ContextWrapper/WrapperWithContext'
import '@/global.css'

export const metadata = {
  title: 'Next.js + Three.js',
  description: 'A minimal starter for Nextjs + React-three-fiber and Threejs.',
}

export default async function RootLayout({ children }) {
  const cartId = (await cookies()).get('cartId')?.value
  // Don't await the fetch, pass the Promise to the context provider
  const cart = getCart(cartId)
  return (
    <html lang='en' className='antialiased'>
      <head />
      <body>
        <CartProvider cartPromise={cart}>
          <Navbar></Navbar>
          <WrapperWithContext>
            <Layout>{children}</Layout>
          </WrapperWithContext>
          {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
        </CartProvider>
        {/* To avoid FOUT with styled-components wrap Layout with StyledComponentsRegistry https://beta.nextjs.org/docs/styling/css-in-js#styled-components */}
      </body>
    </html>
  )
}
