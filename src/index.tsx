import * as THREE from 'three';
import { createRoot } from 'react-dom/client';
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function Box(props: JSX.IntrinsicElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!);

    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);

    useFrame((state, delta) => (ref.current.rotation.x += 100*delta));

    return (
        <mesh
        {...props}
        ref={ref}
        scale={clicked ? 1.2 : 1}
        onClick={(e) => click(!clicked)}
        onPointerOver={(e) => hover(true)}
        onPointerOut={(e) => hover(false)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
}

createRoot(document.getElementById('root') as HTMLElement).render(
    <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0.1, 0]} />
    </Canvas>
);
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const box = new THREE.BoxGeometry(1,1,2);
// const mat = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const cube = new THREE.Mesh(box, mat);
// scene.add(cube);
// camera.position.z = 5;
// function animate() {
//     requestAnimationFrame( animate );
//     cube.rotation.x += 0.01;
//     cube.rotation.y += 0.01;
//     renderer.render( scene, camera );
// }
// animate();
