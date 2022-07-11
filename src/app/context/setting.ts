import React, { Dispatch, SetStateAction, useContext } from "react";
import { LocationType } from "../types/LocationType";

export type SettingContextType = {
    time: number;
    setTime: Dispatch<SetStateAction<number>>;
    location: LocationType;
    setLocation: Dispatch<SetStateAction<LocationType>>;
}

export const SettingContext = React.createContext<SettingContextType | null>(null);
export const useTime = () => useContext(SettingContext);