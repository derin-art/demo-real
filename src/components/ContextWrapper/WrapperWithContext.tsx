'use client'

import { createContext, Dispatch, ReactNode, SetStateAction, useState } from 'react'

export interface WrapperContextProps {
  isOpen: boolean
  index: number
  setThoughtState: Dispatch<SetStateAction<{ isOpen: boolean; index: number }>>
  rotationSpeed: number
  setRotationSpeed: Dispatch<SetStateAction<number>>
}

export const WrapperContext = createContext<WrapperContextProps | null>(null)

export default function WrapperWithContext(props: { children: ReactNode }) {
  const [thoughtsState, setThoughtState] = useState({ isOpen: true, index: 0 })
  const [rotationSpeed, setRotationSpeed] = useState(0.5)
  return (
    <WrapperContext.Provider
      value={{
        index: thoughtsState.index,
        isOpen: thoughtsState.isOpen,
        setThoughtState: setThoughtState,
        rotationSpeed,
        setRotationSpeed,
      }}
    >
      {props.children}
    </WrapperContext.Provider>
  )
}
