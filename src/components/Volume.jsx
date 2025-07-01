import React, { useRef, useState } from 'react'
import { Text } from '@react-three/drei';

import { useFrame } from '@react-three/fiber'
import { log } from 'three/src/nodes/TSL.js';


function parseDimension(dim) {
    if (!dim) return 1;
    const [valueStr, unit] = dim.split(' ');
    const value = parseFloat(valueStr);
    if (isNaN(value)) return 1;

    switch (unit) {
        case 'mm': return value / 1000;  // 1 mm = 1/1000 m
        case 'cm': return value / 100;       // 1 cm = 1/100 m
        case 'm': return value; // base unit meter
        default: return value;          // assume meter if no unit
    }
}



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
    // Parse translation (in meters)


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