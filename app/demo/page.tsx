'use client'
import Editor from '@/components/editor/Editor'
import { useEffect, useState, useMemo } from 'react'
import { Object3D, Object3DEventMap } from 'three'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
const Car = dynamic(() => import('../../src/components/models/Car'), { ssr: false })
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
  return (
    <>
      <Car></Car>
    </>
  )
}
