import { Text } from '@react-three/drei';
import { Line, BufferGeometry, LineBasicMaterial, Vector3 } from 'three';
import { AXIS_TICKS_LABEL_COLOR } from '../constants/globalScene.js';


export default function AxisTicks({ axis = 'x', length = 10 }) {
    const ticks = [];
    const mmStep = 0.1; // 1 mm = 0.1 units
    const totalSteps = (length * 2) / mmStep;

    for (let i = 0; i <= totalSteps; i++) {
        const value = -length + i * mmStep;

        // Skip origin label
        if (Math.abs(value) < 1e-5) continue;

        // Is this a full cm tick?
        const isCm = Math.abs(value % 1) < 1e-5;

        let start, end, labelPos;
        const tickSize = isCm ? 0.2 : 0.05;
        const color = isCm ? 'green' : '#0f0';
        const fontSize = 0.1;

        switch (axis) {
            case 'x':
                start = new Vector3(value, -tickSize, 0);
                end = new Vector3(value, tickSize, 0);
                labelPos = [value, tickSize + 0.1, 0];
                break;
            case 'y':
                start = new Vector3(-tickSize, value, 0);
                end = new Vector3(tickSize, value, 0);
                labelPos = [tickSize + 0.1, value, 0];
                break;
            case 'z':
                start = new Vector3(0, -tickSize, value);
                end = new Vector3(0, tickSize, value);
                labelPos = [0.1, tickSize + 0.1, value];
                break;
        }

        const geometry = new BufferGeometry().setFromPoints([start, end]);
        const material = new LineBasicMaterial({ color });

        ticks.push(
            <primitive key={`${axis}-tick-${value.toFixed(1)}`} object={new Line(geometry, material)} />
        );

        if (isCm) {
            ticks.push(
                <Text
                    key={`${axis}-label-${value}`}
                    position={labelPos}
                    fontSize={fontSize}
                    color={AXIS_TICKS_LABEL_COLOR}
                >
                    {value.toFixed(0)}cm
                </Text>
            );
        }
    }

    return <>{ticks}</>;
}

