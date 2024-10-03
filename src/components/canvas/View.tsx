'use client'

import { forwardRef, Suspense, useImperativeHandle, useRef } from 'react'
import { OrbitControls, PerspectiveCamera, View as ViewImpl } from '@react-three/drei'
import { Three } from '@/helpers/components/Three'

export const Common = (props: { color; camePosition?: any }) => {
  const { camePosition, color } = props
  const position = camePosition ? camePosition : [0, 0, 6]
  return (
    <Suspense fallback={null}>
      {color && <color attach='background' args={[color]} />}
      <ambientLight />
      <pointLight position={[20, 30, 10]} intensity={3} decay={0.2} />
      <pointLight position={[-10, -10, -10]} color='blue' decay={0.2} />
      <PerspectiveCamera makeDefault fov={40} position={position} />
    </Suspense>
  )
}

const View = forwardRef(({ children, orbit, ...props }: any, ref) => {
  const localRef = useRef(null)
  useImperativeHandle(ref, () => localRef.current)

  return (
    <>
      <div ref={localRef} {...props} />
      <Three>
        <ViewImpl track={localRef}>
          {children}
          {orbit && <OrbitControls />}
        </ViewImpl>
      </Three>
    </>
  )
})
View.displayName = 'View'

export { View }
