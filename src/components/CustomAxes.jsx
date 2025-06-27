import { Text } from '@react-three/drei';
import { Line, BufferGeometry, LineBasicMaterial, Vector3 } from 'three';
import AxisTicks from './CustomAxesTicks';
import { AXIS_LABEL_FONT_SIZE, AXIS_LABEL_FONT_COLOR } from '../constants/globalScene';

function AxisLine({ start, end, color }) {
    const points = [start, end];
    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({ color });
    return <primitive object={new Line(geometry, material)} />;
}

function AxisLabel({ position, text }) {
    return (
        <Text position={position} fontSize={AXIS_LABEL_FONT_SIZE} color={AXIS_LABEL_FONT_COLOR}>
            {text}
        </Text>
    );
}

export default function CustomAxes({ single_axis_length }) {
    const length = single_axis_length;

    return (
        <>
            {/* Axis lines */}
            <AxisLine start={new Vector3(-length, 0, 0)} end={new Vector3(length, 0, 0)} color="red" />
            <AxisLine start={new Vector3(0, -length, 0)} end={new Vector3(0, length, 0)} color="green" />
            <AxisLine start={new Vector3(0, 0, -length)} end={new Vector3(0, 0, length)} color="blue" />

            {/* Axis labels */}
            <AxisLabel position={[length + 0.3, 0, 0]} text="X+" />
            <AxisLabel position={[-length - 0.7, 0, 0]} text="X-" />
            <AxisLabel position={[0, length + 0.3, 0]} text="Y+" />
            <AxisLabel position={[0, -length - 0.7, 0]} text="Y-" />
            <AxisLabel position={[0, 0, length + 0.3]} text="Z+" />
            <AxisLabel position={[0, 0, -length - 0.7]} text="Z-" />

            {/* Ticks + Measurement Labels */}
            <AxisTicks axis="x" length={length} />
            <AxisTicks axis="y" length={length} />
            <AxisTicks axis="z" length={length} />
        </>
    );
}
