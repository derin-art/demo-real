import { useState } from 'react'

interface EditorProps {
  meshArray: string[]
  buttonsArray: { name: string; onClick: (color: string) => void }[]
  Mesh: any
  testFunction: () => void
}

export default function Editor(props: EditorProps) {
  const [meshProperties, setMeshProperties] = useState()
  const { buttonsArray } = props

  return (
    <div className='w-[200px] justify-center items-center h-[200px] bg-gray-100 rounded-[5px] flex flex-col mx-auto'>
      <div className='font-bold'>Body color controls</div>

      <div className='flex flex-col items-center'>
        {buttonsArray.map((item, index) => {
          return (
            <div key={index}>
              <button
                key={index}
                onClick={() => {
                  item.onClick(item.name)
                }}
                style={{ backgroundColor: item.name }}
                className='w-[50px] h-[50px] rounded-[4px]'
              ></button>
              <span></span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
