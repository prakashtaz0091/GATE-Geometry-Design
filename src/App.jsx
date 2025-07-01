import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats, Text } from '@react-three/drei'
import { GridHelper, AxesHelper } from 'three';
import { GRID_SIZE, DIVISIONS } from './constants/globalScene.js';
import Panel from './components/Panel'
import Volume from './components/Volume'
import { useState } from 'react'
import useStore from './store/useStore'


function App() {

  const geometries = useStore((state) => state.geometries)


  return (
    <div className="">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100vw', height: '100vh' }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <primitive object={new GridHelper(GRID_SIZE, DIVISIONS, '#000', '#666')} />
        {/* <primitive object={new AxesHelper(GRID_SIZE / 2)} /> */}

        <group>
          <primitive object={new AxesHelper(GRID_SIZE / 2)} />

          {/* Axis Labels */}
          <Text position={[GRID_SIZE / 2 + 0.2, 0, 0]} fontSize={0.3} color="red">
            X
          </Text>
          <Text position={[0, GRID_SIZE / 2 + 0.2, 0]} fontSize={0.3} color="green">
            Y
          </Text>
          <Text position={[0, 0, GRID_SIZE / 2 + 0.2]} fontSize={0.3} color="blue">
            Z
          </Text>
        </group>

        {/* <Stats /> */}

        {geometries &&
          geometries.filter((geometryObj) => geometryObj.vis.visible === true)
            .map((geometryObj) => (
              <Volume geometry={geometryObj} />
            ))}

      </Canvas>
      <Panel />
    </div>
  )
}

export default App
