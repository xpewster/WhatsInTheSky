import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useContext, useEffect } from "react";
import { useRef, useState } from "react";
import * as THREE from "three";
import { SettingContext, SettingContextType } from "./app/context/setting";
import { Loader, PerspectiveCamera, OrbitControls, FirstPersonControls, PointerLockControls } from "@react-three/drei";
import { getTimes, skyColor, sunriseset } from "./app/math/sky";
import { GridHelper, SphereGeometry, Vector3 } from "three";
import { EffectComposer, Bloom, SelectiveBloom, Selection } from "@react-three/postprocessing";
import { CameraControls } from "./app/utils/CameraControls";


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

// const CameraControls = () => {
//     const {camera, gl} = useThree();
//     const controls = new OrbitControls(camera, gl.domElement);

//     controls.enablePan = false;

//     return null;
// }

const Sky = ({ sunTimes }: {sunTimes: Date[]}) => {
    const ref = useRef<THREE.MeshPhongMaterial>(null!);
    //let background_color = new THREE.Color(0x2f0342);
    let background_color = new THREE.Color(0x704b80);
    
    const settingContext = useContext(SettingContext) as SettingContextType;

    useEffect(() => {
        background_color = skyColor(settingContext.time, sunTimes);
        ref.current.color = background_color;
    }, [settingContext.time, sunTimes]);

    return (
        <mesh>
            <sphereGeometry args={[1000, 0, 0]} />
            <meshPhongMaterial ref={ref} color={background_color} side={THREE.BackSide} />
        </mesh>
    );
}

const Ground = (props: JSX.IntrinsicElements['mesh']) => {
    return (
        <mesh
            {...props}
            rotation={[0, 0, 0]}>
            <meshBasicMaterial color={'black'} />
            <planeGeometry args={[1000, 1000]} />
        </mesh>
    )
}

type sunProps = {
    sunTimes: Date[],
    position: Vector3,
    lightRef: React.MutableRefObject<THREE.Light>,
}

const Sun = ({ sunTimes, position, lightRef }: sunProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);
    const matRef = useRef<THREE.MeshBasicMaterial>(null!);
    const plightRef = useRef<THREE.PointLight>(null!);

    let color = new THREE.Color(255, 255, 240);

    const settingContext = useContext(SettingContext) as SettingContextType;

    useEffect(() => {
        color = skyColor(settingContext.time, sunTimes);
        matRef.current.color = color;
        plightRef.current.color = color;
    }, [settingContext.time, sunTimes]);

    return (
        <mesh position={position} ref={meshRef}>
            <sphereGeometry args={[50, 16, 8]}/>
            <meshBasicMaterial ref={matRef} color={[255, 255, 240]} />
            <pointLight ref={plightRef} color={[255, 255, 240]} intensity={1} />
            {/* <EffectComposer autoClear={false}>
                <SelectiveBloom
                    selection={[meshRef]}
                    intensity={2.0}
                    luminanceThreshhold={0.01}
                    luminanceSmoothing={0.025}
                    lights={[lightRef]}
                />
            </EffectComposer> */}
        </mesh>
    )
}

const App = () => {
    const [time, setTime] = React.useState(new Date());
    const [location, setLocation] = React.useState({latitude: 0, longitude: 0});
    const [sunTimes, setSunTimes] = React.useState<Date[]>([]);
    const [sunPos, setSunPos] = React.useState(new Vector3(0, 1000, 0));

    const lightRef = useRef<THREE.AmbientLight>(null!);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                setLocation({latitude: position.coords.latitude, longitude: position.coords.longitude});
            })
        } else {
            setLocation({latitude: 30.86265, longitude: -98.82478}); // my spot :)
        }
    }, []);

    useEffect(() => {
        setSunTimes(getTimes(time, location.latitude, location.longitude));
    }, [location])

    return (
        <>
            <h1>text sd2</h1>
            <Canvas>
                <ambientLight ref={lightRef} intensity={1}/>
                <PerspectiveCamera makeDefault fov={75} position={[0,0,1e-5]} far={1200} aspect={window.innerWidth/window.innerHeight} />
                {/* <OrbitControls enablePan={false} maxDistance={5}/> */}
                <CameraControls />
                <SettingContext.Provider value={{time, setTime, location, setLocation}}>
                    <Sky sunTimes={sunTimes}/>
                    <Sun sunTimes={sunTimes} position={sunPos} lightRef={lightRef}/>
                </SettingContext.Provider> 
                <gridHelper />
                <Ground position={[0, 0, 0]} />
                <Box position={[0, 0, -1.2]} />
                <Box position={[0, 0.1, 1.2]} />
            </Canvas>
            <Loader />
        </>
    )
}

export default App;