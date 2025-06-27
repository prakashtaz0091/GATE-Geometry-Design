import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { GridHelper, AxesHelper } from 'three';
import CustomAxes from './components/CustomAxes.jsx'
import { GRID_SIZE } from './constants/globalScene.js';

function App() {

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100vw', height: '100vh' }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <primitive object={new GridHelper(GRID_SIZE, GRID_SIZE, '#000', '#666')} />

        <CustomAxes single_axis_length={GRID_SIZE / 2} />
        <Stats />
      </Canvas>
    </div>
  )
}

export default App
