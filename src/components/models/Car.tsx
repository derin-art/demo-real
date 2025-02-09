'use client'
import {
  Stars,
  OrbitControls,
  useHelper,
  useGLTF,
  Html,
  Instances as Istances,
  Instance,
  View as VIEW,
  PerspectiveCamera,
  OrthographicCamera,
  Line,
  Sky,
} from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { useEffect, useState, useMemo, useRef, Suspense } from 'react'
import { WrapperContext, WrapperContextProps } from '../ContextWrapper/WrapperWithContext'
import { useContext } from 'react'
import { Canvas, Vector3 } from '@react-three/fiber'
import { Bloom, EffectComposer, Noise, Autofocus, DepthOfField, FXAA } from '@react-three/postprocessing'
import { BlurPass, Resizer, KernelSize, Resolution } from 'postprocessing'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import BackgroundRandomness from '../../../public/Constelaltion/1x/Asset 5.png'
import { BlendFunction } from 'postprocessing'
import Image from 'next/image'
import alphaMapImg from '../../../public/Constelaltion/1x/Map4.png'
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

const Star = ({
  objColor,
  render,
  parentMeshInstance,
  id,
  object,
  temp = new THREE.Object3D(),
  farthestPoint,
  ...props
}) => {
  /* Wrapper Context */
  const { index, isOpen, setThoughtState, setRotationSpeed } = useContext(WrapperContext) as WrapperContextProps
  /* End */

  /* Handle Click */
  const handleStarClick = () => {
    setThoughtState((prev) => ({ ...prev, isOpen: false, index: 1 }))
  }

  /* End */

  const ref: any = useRef()

  useEffect(() => {
    if (!ref.current) return

    ref.current.position.copy(object.position)
    ref.current.scale.set(10.0, 10.0, 10.0)
  }, [object])

  /* Hover Logic */

  const [hovered, setHover] = useState(false)
  const color = new THREE.Color()
  const random = useMemo(() => Math.random(), [])
  /* ref.current.material.opacity = Math.random() */

  /* Set color */

  const randomFour = random > 0.2 ? random : 0.5
  const rgbVal = { a: 255, b: 0, c: 0 }
  const { a, b, c } = rgbVal
  const aRandom = Math.floor(a * randomFour)
  const setColor = `rgb(${aRandom}, ${aRandom}, ${aRandom})`
  /* End */

  /* Lerp Color */
  const lerpColor = (normalizedTime: number) => {
    const newRandomNumber = Math.floor(normalizedTime * 200)
    const finalRandom = id % 2 ? aRandom - newRandomNumber : aRandom + newRandomNumber

    return `rgb(${finalRandom}, ${finalRandom}, ${finalRandom})`
  }
  /* End */

  /* Furthest Point Color Logic */
  const furthestPoint: THREE.Vector3 = farthestPoint
  /* End */

  /* Math.sin(state.clock.getElapsedTime() * 1.4 */

  const returnColor = () => {
    if (ref.current) {
      const meshPosition = ref.current.position
      if (!meshPosition.x) {
        return 1
      } else return meshPosition.x / furthestPoint.x
    } else return 0.5
  }

  const sortingHat = (NormalizedPosition: any) => {
    let color = new THREE.Color(0.01, 0.01, 0.3)

    const coorColors = [
      { range: [0, 0.2], color: 'red', colorRange: { x: [0.5, 0.6], y: [0.1, 0.2] } },
      { range: [0.2, 0.5], color: 'red', colorRange: { x: [0.7, 0.8], y: [0.5, 0.6] } },
      { range: [0.5, 1], color: 'red', colorRange: { x: [0.8, 1], y: [0.8, 1] } },
    ]

    coorColors.forEach((item) => {
      if (NormalizedPosition.x > item.range[0] && NormalizedPosition.x < item.range[1]) {
        const xDif = item.colorRange.x[1] - item.colorRange.x[0]
        const yDif = item.colorRange.y[1] - item.colorRange.y[0]

        const x = xDif * (NormalizedPosition.x / item.range[1]) + item.colorRange.x[0]
        const y = yDif * (NormalizedPosition.x / item.range[1]) + item.colorRange.y[0]
        color.set(x, y, 0.3)
      }
    })

    return color
  }

  /*  console.log(objColor) */

  useFrame((state) => {
    if (ref.current) {
      /* const math = new THREE.Color(returnColorFrame(), 1 - returnColorFrame(),1) */
      /* const selectionColor =  sortingHat({x: returnColorFrame(), y: returnColorFrame()}) */

      const t = state.clock.getElapsedTime() + random * 10000
      /*  c */
      /* ref.current.position.y = Math.sin(t / 1.5) / 2 */

      ref.current.scale.x =
        ref.current.scale.y =
        ref.current.scale.z =
          THREE.MathUtils.lerp(ref.current.scale.z, hovered ? 2.3 : 1, 0.05)
      ref.current.color.lerp(color.set(hovered ? 'yellow' : objColor), hovered ? 1 : 0.1)
    }
  })
  /* End */

  const randomRotation = useMemo(() => Math.PI * 2 * Math.random(), [])

  return (
    <group
      rotation={[Math.PI / 4, 0, 0]}
      onPointerLeave={() => {
        setRotationSpeed(0.5)
        setHover(false)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        setRotationSpeed(0.1)
      }}
      scale={random + 1}
      {...props}
    >
      {hovered && (
        <Html
          pointerEvents='none'
          scale={10}
          rotation={[0, Math.PI / 2, 0]}
          position={
            ref.current.position ? [ref.current.position.x, ref.current.position.y, ref.current.position.z] : [0, 0, 0]
          }
          className='text-[10px] font-bold z-0 text-black bg-white w-fit border px-2 p-[2px] mt-2 rounded '
        >
          {ref.current
            ? `e:${Math.floor(ref.current.position.x) + ',' + 'n:' + Math.floor(ref.current.position.y)}`
            : '0.5, 0.1'}
        </Html>
      )}
      <Instance
        onClick={() => {
          handleStarClick()
        }}
        ref={ref}
      />
    </group>
  )
}

function Constelaltion({ count = 10, objects, temp = new THREE.Object3D() }) {
  /* Boxes ref */
  const boxRef = useRef(null)
  /* End */

  /* TextureMap */
  const alphaTexture = useLoader(THREE.TextureLoader, alphaMapImg.src)
  /* End */

  /* Box Geometry */
  const geometry = new THREE.SphereGeometry(0.02 * 7, 32, 7)
  const material = new THREE.MeshStandardMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    flatShading: true,
    emissiveIntensity: 0.8,
    emissive: 'white',
    opacity: 0.7,
    toneMapped: false,

    emissiveMap: alphaTexture,

    depthWrite: false,
  })
  /* End */

  /* Mesh Instance */
  const starsMeshInstance: THREE.InstancedMesh = boxRef.current

  /* End */

  const retrieveFurthestPoints = (objects: THREE.InstancedMesh) => {
    let largestVector = new THREE.Vector3(0, 0, 0)
    if (!objects) return
    const instances = objects.children

    for (let i = 0; i < instances.length; i++) {
      const instance = instances[i]

      const positionMeshData = instance.children[0].position
      if (positionMeshData.x > largestVector.x) {
        largestVector.setX(positionMeshData.x)
      }
      if (positionMeshData.y > largestVector.y) {
        largestVector.y = positionMeshData.y
      }
      if (positionMeshData.z > largestVector.z) {
        largestVector.z = positionMeshData.z
      }
    }

    return largestVector
  }

  const furthestPoints = useMemo(() => {
    return retrieveFurthestPoints(starsMeshInstance)
  }, [starsMeshInstance])

  const [render, setIsRender] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsRender(true)
    }, 2000)
  }, [])

  const sortingHat = (NormalizedPosition: any) => {
    let color = new THREE.Color(0.01, 0.4, 0.7)

    const coorColors = [
      { range: [0, 0.2], color: 'red', colorRange: { x: [0.1, 0.2], y: [0.1, 0.2], z: [0.7, 0.9] } },
      { range: [0.2, 0.4], color: 'red', colorRange: { x: [0.9, 1], y: [0.1, 0.14], z: [0.8, 0.9] } },
      { range: [0.4, 0.6], color: 'red', colorRange: { x: [0.9, 1], y: [0.5, 0.6], z: [0.1, 0.15] } },
      { range: [0.6, 0.8], color: 'red', colorRange: { x: [0.1, 0.15], y: [0.7, 0.75], z: [0.4, 0.5] } },
      { range: [0.8, 1], color: 'red', colorRange: { x: [0.9, 1], y: [0.1, 0.15], z: [0.1, 0.15] } },
    ]

    coorColors.forEach((item, index) => {
      if (NormalizedPosition.x > item.range[0] && NormalizedPosition.x < item.range[1]) {
        const xDif = item.colorRange.x[1] - item.colorRange.x[0]
        const yDif = item.colorRange.y[1] - item.colorRange.y[0]
        const zDif = item.colorRange.z[1] - item.colorRange.z[0]
        const nonNegativeNormalized = NormalizedPosition.x
        const x = xDif * (nonNegativeNormalized / item.range[1]) + item.colorRange.x[0]
        const y = yDif * (nonNegativeNormalized / item.range[1]) + item.colorRange.y[0]
        const z = zDif * (nonNegativeNormalized / item.range[1]) + item.colorRange.z[0]
        color.set(x, y, z)
      }
    })

    return color
  }

  return (
    <group>
      <Istances geometry={geometry} material={material} ref={boxRef} range={count}>
        {/*  <boxGeometry />
        <meshStandardMaterial color="red" /> */}
        {starsMeshInstance &&
          objects.map((obj, i) => {
            const returnColor = () => {
              const normalizedX = (obj.position.x / retrieveFurthestPoints(starsMeshInstance).x + 1) / 2
              return normalizedX
            }
            const mewColor = sortingHat({ x: returnColor(), y: returnColor() })
            return (
              <Star
                objColor={mewColor}
                render={render}
                parentMeshInstance={starsMeshInstance}
                farthestPoint={furthestPoints}
                key={i}
                id={i}
                object={obj}
              />
            )
          })}
      </Istances>
    </group>
  )
}

const ConstelaltionGroup = ({ count, _normal = new THREE.Vector3(), _position = new THREE.Vector3() }) => {
  const objects = useMemo(() => Array.from({ length: count }).map(() => new THREE.Object3D()), [count])
  const [trees, setTrees] = useState([])

  const [counter, setCounter] = useState(0)
  const [scrambledFinalPointsState, setScrambledState] = useState([])

  const rand11 = () => Math.random() * 2.0 - 1.0

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const tree = objects[i]

      /* Perlin Noise Logic */
      var v = new THREE.Vector3()
      v.randomDirection().setLength(2 * Math.pow(Math.random(), 1 / 3))
      v.x = 1.2 * 24 * v.x * (1 + 0.4 * Math.sin(3 * v.y) + 0.4 * Math.sin(2 * v.z))
      v.y = 0.4 * 24 * v.y * (1 + 0.4 * Math.sin(3 * v.z) + 0.4 * Math.sin(3 * v.x))
      v.z = 0.2 * 24 * v.z * (1 + 0.4 * Math.sin(3 * v.x) + 0.4 * Math.sin(2 * v.y))
      /* End */

      tree.position.set(v.x, v.y, v.z)
    }

    setTrees(objects)
  }, [count])

  /* Initialize Counter */
  useEffect(() => {
    /*  setInterval(()=>{setCounter(prev => {
      if(trees.length > 0){
 if(prev >= trees.length - 8 - 1){
        return prev
      }else return prev + 1
      }else return prev + 1
     
    })}, 100) */
  }, [])
  /* End */

  const scrambledFinalPoints = []

  const finalPoints: any = useMemo(() => {
    const counterMaybe = () => {
      let randOm = Math.random()
      if (randOm > 0.8) {
        randOm = 0.8
      } else if (randOm < 0.2) {
        randOm = 0.2
      }
      return Math.floor(randOm * trees.length)
    }

    const numberMaybe = counterMaybe()

    return trees.slice(counter, counter + 8).map((item) => {
      const starPosition = [item.position.x, item.position.y, item.position.z]

      return starPosition
    })
  }, [trees, counter])

  /* useEffect(()=>{
    finalPoints.forEach((item)=>{
    const randomNumber = Math.floor(Math.random() * (finalPoints.length - 1))
    scrambledFinalPoints.push(finalPoints[randomNumber])
  })
  console.log("dd")
}, [counter]) */

  /* useEffect(()=>{
   finalPoints.forEach((item)=>{
    
    scrambledFinalPoints.push(finalPoints[Math.floor(Math.random() * (finalPoints.length - 1))])
   })
   setScrambledState(scrambledFinalPoints)
   
}, [counter])

console.log("d",scrambledFinalPointsState) */

  return (
    <group rotation={[0, 0, Math.PI / 12]} rotation-x={-Math.PI / 20} position={[0, 11, 0]}>
      {/*      {finalPoints[0] && <Line dashed lineWidth={0.8} color={'yellow'} points={finalPoints}></Line>} */}
      <Constelaltion objects={trees} count={count} />
    </group>
  )
}

const CustomCamera = () => {
  /* Camera Helper */
  const camera = useRef()
  /*  useHelper(camera, THREE.CameraHelper) */
  /* End */

  const LookAt: any = new THREE.Vector3(0, 0, 0)
  return (
    <OrthographicCamera
      zoom={7.8}
      far={10000}
      ref={camera}
      makeDefault
      lookAt={() => {
        return LookAt
      }}
      isCamera
      position={[0, 0, 2000]}
    ></OrthographicCamera>
  )
}

export default function Cluster({ data }: { data: any }) {
  console.log('se', data)
  /* Wrapper Context */
  const { index, isOpen, setThoughtState, rotationSpeed } = useContext(WrapperContext) as WrapperContextProps
  /* End */

  /* Handle Click */
  const handleCloseClick = () => {
    setThoughtState((prev) => ({ ...prev, isOpen: true, index: 1 }))
  }

  /* End */

  /* Count */
  const [count, setCount] = useState(700)
  /* End */

  useEffect(() => {
    /*     setTimeout(()=>{setCount(2000)}, 5000) */
  }, [])

  /* Canvas Ref */
  const canvasRef = useRef()

  /* End */
  const ref = useRef()
  const { scene } = useGLTF('/scene.glb')

  return (
    <div className='p-[24px] bg-white h-screen w-screen'>
      <div className='rounded-[12px] relative w-full h-full  bg-gradient-to-b from-black from-[75%] to-gray-500 overflow-hidden '>
        <Image
          className='w-full h-full absolute top-0 z-0  opacity-[0.8] '
          unoptimized
          src={BackgroundRandomness.src}
          width={100}
          height={100}
          alt='Background randomness'
        ></Image>

        <Canvas className='w-full' ref={canvasRef}>
          {/*  <Grid cellSize={1} infiniteGrid ></Grid> */}
          {/*     <InstancesR3F></InstancesR3F> */}
          <Suspense>
            <group rotation={[100, 40, 0]}>
              <mesh position={[-30, 30, -120]}>
                <sphereGeometry args={[1.5, 32, 32]}></sphereGeometry>
                <meshStandardMaterial emissiveIntensity={4} emissive={'orange'} color={'brown'}></meshStandardMaterial>
              </mesh>
              <mesh position={[60, -10, -100]}>
                <sphereGeometry args={[2, 32, 32]}></sphereGeometry>
                <meshStandardMaterial emissiveIntensity={6} emissive={'white'} color={'orange'}></meshStandardMaterial>
              </mesh>
              <Stars factor={10} count={20000} radius={50} speed={0.1} fade depth={5} saturation={10}></Stars>
              <CustomCamera></CustomCamera>
              {/*  <OrthographicCamera ></OrthographicCamera> */}
              <ConstelaltionGroup count={count} />
            </group>
            {!isOpen && (
              <Html center className='overflow-hidden p-4 text-black bg-white w-[400px] h-[300px] rounded-md relative'>
                <button
                  onClick={() => {
                    handleCloseClick()
                  }}
                  className='border text-[10px] p-2 absolute right-0 top-0 bg-red-500 text-white'
                >
                  close
                </button>
                "It's the simple things in life that are the most extraordinary; only wise men are able to understand
                them"
              </Html>
            )}
            <ambientLight intensity={8}></ambientLight>
            {/*     <OrbitControls
              autoRotateSpeed={0}
              minPolarAngle={Math.PI / 2}
              maxPolarAngle={Math.PI / 2}
              target={[0, 0, 0]}
              autoRotate={isOpen}
            ></OrbitControls> */}
            <fog color={'red'}></fog>
          </Suspense>
          <EffectComposer enabled>
            <Bloom
              luminanceThreshold={0}
              mipmapBlur
              blendFunction={BlendFunction.LIGHTEN}
              intensity={4.5}
              kernelSize={2.5}
              levels={8}
            ></Bloom>
            <Noise premultiply blendFunction={BlendFunction.LIGHTEN} />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  )
}
