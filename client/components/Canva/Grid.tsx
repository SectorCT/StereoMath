import { Euler } from '@react-three/fiber';

export default function Grid() {
    return (
        <>
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[100, 100, 100, 100]} />
                <meshBasicMaterial color="#f9c74f" wireframe />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[1.5 * Math.PI, 0, 0] as Euler}>
                <planeGeometry args={[100, 100, 100, 100]} />
                <meshBasicMaterial color="pink" wireframe />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0] as Euler}>
                <planeGeometry args={[100, 100, 100, 100]} />
                <meshBasicMaterial color="#80ffdb" wireframe />
            </mesh>
        </>
    )
}