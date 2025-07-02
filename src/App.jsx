import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats, Text } from '@react-three/drei'
import { GridHelper, AxesHelper } from 'three';
import { GRID_SIZE, DIVISIONS } from './constants/globalScene.js';
import Panel from './components/Panel'
import Volume from './components/Volume'
import useStore from './store/useStore'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from './components/TopBar.jsx';


function App() {

  const geometries = useStore((state) => state.geometries)
  const visGrid = useStore((state) => state.visGrid)


  return (
    <div className="">
      {/* to show toast messages */}
      <ToastContainer />

      <TopBar />

      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: '100vw', height: '100vh' }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {
          visGrid &&
          <primitive object={new GridHelper(GRID_SIZE, DIVISIONS, '#000', '#666')} />
        }
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
