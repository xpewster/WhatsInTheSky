import React, { Dispatch, SetStateAction, useContext } from "react";
import { LocationType } from "../types/LocationType";

export type SettingContextType = {
    time: Date;
    setTime: Dispatch<SetStateAction<Date>>;
    location: LocationType;
    setLocation: Dispatch<SetStateAction<LocationType>>;
}

export const SettingContext = React.createContext<SettingContextType | null>(null);
export const useTime = () => useContext(SettingContext);
