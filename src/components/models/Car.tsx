'use client'
import { OrbitControls, useGLTF } from '@react-three/drei'
import Editor from '@/components/editor/Editor'
import { useEffect, useState, useMemo } from 'react'
import { Object3D, Object3DEventMap } from 'three'

import * as THREE from 'three'
import dynamic from 'next/dynamic'
const DuckTwo = dynamic(() => import('@/components/canvas/Examples').then((mod) => mod.DuckTwo), { ssr: false })
const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
  ssr: false,
  loading: () => (
    <div className='flex h-96 w-full flex-col items-center justify-center'>
      <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  ),
})
const Common = dynamic(() => import('@/components/canvas/View').then((mod) => mod.Common), { ssr: false })

export default function Page() {
  const { scene } = useGLTF('/scene.glb')
  useMemo(
    () =>
      scene.traverse((obj: any) => {
        if (obj.name === 'orange_glass001') {
          obj.material.color = new THREE.Color('red')
        }
        // traverse and mutate the scene here ...
      }),
    [scene],
  )
  const generateOptions = () => {
    if (!scene) return null
    const { children } = scene.children[0].children[0]
    console.log(children)

    return children
  }

  const [meshProperties, setMeshProperties] = useState<Object3D<Object3DEventMap>[] | null>(null)

  useEffect(() => {
    const objectArray = generateOptions()
    if (scene) {
      setMeshProperties(objectArray)
    }
  }, [scene])

  /*  useEffect(() => {
    if (meshProperties) {
      scene.children[0].children[0].children = meshProperties
    }
  }, [meshProperties]) */

  if (scene) {
    console.log('newv', scene)
  }

  const testFunction = () => {
    if (!scene) return null

    scene.traverse((obj: any) => {
      if (obj.name === 'body001') {
        console.log('george', obj)
        obj.material.color = new THREE.Color('blue')
      }
      // traverse and mutate the scene here ...
    })
  }
  const testFunctionColor = (color: string) => {
    if (!scene) return null
    if (!color) return
    scene.traverse((obj: any) => {
      if (obj.name === 'body001') {
        obj.material.color = new THREE.Color(color)
      }
      // traverse and mutate the scene here ...
    })
  }

  const buttonsArray = [
    {
      name: 'blue',
      onClick: testFunctionColor,
    },
    { name: 'gray', onClick: testFunctionColor },
    { name: 'yellow', onClick: testFunctionColor },
  ]

  return (
    <>
      <div className='mx-auto relative flex w-full flex-col flex-wrap items-center md:flex-row  lg:w-4/5'>
        <div className='flex w-full flex-col items-start justify-center p-12 text-center md:w-2/5 md:text-left'>
          <p className='w-full uppercase'>Next + React Three Fiber</p>
          <h1 className='my-4 text-5xl font-bold leading-tight'>Next 3D Starter</h1>
          <p className='mb-8 text-2xl leading-normal'>A minimalist starter for React, React-three-fiber and Threejs.</p>
        </div>
      </div>
      <div className='absolute bottom-2 right-2 z-40'>
        {DuckTwo && (
          <Editor
            buttonsArray={buttonsArray}
            testFunction={() => {
              testFunction()
            }}
            Mesh={DuckTwo}
            meshArray={['front_window']}
          ></Editor>
        )}
      </div>

      <View className='absolute top-0 flex h-screen w-full flex-col items-center justify-center'>
        <DuckTwo object={scene} scale={2} position={[0, -1.6, 0]} />
        <OrbitControls></OrbitControls>
        <Common camePosition={[0, 0, 20]} color={'white'} />
      </View>
    </>
  )
}
