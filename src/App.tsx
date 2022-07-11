import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useContext } from "react";
import { useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SettingContext, SettingContextType } from "./app/context/setting";
import { Loader } from "@react-three/drei";
import { skyColor } from "./app/math/sky";



function Box(props: JSX.IntrinsicElements['mesh']) {
    const ref = useRef<THREE.Mesh>(null!);

    const [hovered, hover] = useState(false);
    const [clicked, click] = useState(false);

    useFrame((state, delta) => (ref.current.rotation.x += 3*delta));

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

const CameraControls = () => {
    const {camera, gl} = useThree();
    const controls = new OrbitControls(camera, gl.domElement);

    controls.enablePan = false;

    return null;
}

const Sky = () => {
    const ref = useRef<THREE.Color>(null!);
    //let background_color = new THREE.Color(0x2f0342);
    let background_color = new THREE.Color(0x704b80);
    
    const settingContext = useContext(SettingContext) as SettingContextType;

    useFrame((state, delta) => {
        background_color = skyColor(settingContext.time, settingContext.location);
        ref.current.set(background_color);
    }
    );
    return (
        <color 
            ref={ref}
            attach={"background"} 
            args={[background_color]} 
        />
    );
}


const App = () => {
    const [time, setTime] = React.useState(Date.now());
    const [location, setLocation] = React.useState({latitude: 0, longitude: 0});

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
        })
    } else {
        setLocation({latitude: 30.86265, longitude: -98.82478}); // my spot :)
    }


    return (
        <>
            <h1>text sd2</h1>
            <Canvas>
            <CameraControls />
            <SettingContext.Provider value={{time, setTime, location, setLocation}}>
                <Sky />
            </SettingContext.Provider> 
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-1.2, -0, 0]} />
            <Box position={[1.2, 0.1, 0]} />
            </Canvas>
            <Loader />
        </>
    )
}

export default App;