import React, { useRef, useState } from 'react'
import { Text } from '@react-three/drei';

import { useFrame } from '@react-three/fiber'
import { log } from 'three/src/nodes/TSL.js';
import { parseDimension } from '../helpers/dimensions'

export default function Volume({ geometry }) {
    const mesh = useRef()
    const [hovered, setHovered] = useState(false);


    // Extract type, geometry, vis from full geometry object
    const { type = 'box', geometry: geom = {}, vis = {} } = geometry


    // Parse dimensions
    const x = parseDimension(geom.xLength)
    const y = parseDimension(geom.yLength)
    const z = parseDimension(geom.zLength)


    let position = [0, 0, 0]

    if (geom.translation) {
        const tx = parseDimension(geom.translation?.x);
        const ty = parseDimension(geom.translation?.y);
        const tz = parseDimension(geom.translation?.z);

        position = [tx, ty, tz];
    }


    // Select geometry component based on type
    const geometryComponent = {
        box: <boxGeometry args={[x, y, z]} />,
        sphere: <sphereGeometry args={[Math.max(x, y, z) / 2, 32, 32]} />,
        cylinder: <cylinderGeometry args={[Math.max(x, z) / 2, Math.max(x, z) / 2, y, 32]} />,
    }[type] || <boxGeometry args={[1, 1, 1]} />

    // Color and wireframe
    const color = vis.color
    const wireframe = vis.wireframe || false
    const opacity = vis.opacity ?? 1;

    return (
        <mesh
            ref={mesh}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}

            key={geometry.id}
        >
            {geometryComponent}
            <meshStandardMaterial
                transparent={true}
                opacity={opacity}
                color={color}
                wireframe={wireframe}
            />

        </mesh>
    )
}