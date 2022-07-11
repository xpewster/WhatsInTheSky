import * as THREE from 'three';
import { LocationType } from '../types/LocationType';

export const skyColor = (time: number, location: LocationType): THREE.Color => {
    const timeOfDay = time % 86400000;
     // const gInc = 
    return new THREE.Color(0x4de0e8);
}