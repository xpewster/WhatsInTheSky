import * as THREE from 'three';
import { Time } from '../types/TimeType';

const SunCalc = require('suncalc');


export const sunColor = (time: Date, times: Date[]): THREE.Color => {
    const timeOfDay = time.getTime();
    let dawn = times[Time.AT_Rise].getTime();
    const dusk = times[Time.Night].getTime();
    
    let sunrise = times[Time.Sunrise].getTime();
    const sunset = times[Time.Sunset].getTime();
    

    let r, g, b;
    if (timeOfDay <= sunset && timeOfDay >= sunrise) {
        r = 255;
        g = 255;
        b = 240;
    } else if (timeOfDay > sunset) {
        if (timeOfDay <= dusk) {
            const sunsetLength = dusk-sunset;
            const d = (timeOfDay-sunset)/sunsetLength;
            r = 255;
            g = 255-(d*255);
            b = 240;
            g *= 1-d;
            b *= 1-d*4;
            if (b < 0) {
                b = 0;
            }
        } else {
            r = 255;
            g = 0;
            b = 0;
        }  
    } else {
        if (timeOfDay >= dawn) {
            const sunriseLength = sunrise-dawn;
            const d = (timeOfDay-dawn)/sunriseLength;
            r = 255;
            g = d*255;
            b = 240;
            g *= d;
            b *= d*4;
            if (b > 255) {
                b = 255;
            }
        } else {
            r = 255;
            g = 0;
            b = 0;
        }
    }

    // console.log("timeOfDay="+(timeOfDay%86400000)/3600000+" sunrise="+(sunrise%86400000)/3600000+" sunset="+(sunset%86400000)/3600000);
    // console.log("r="+r+" g="+g+" b="+b);

    return new THREE.Color(r/255, g/255, b/255);
}

export const skyColor = (time: Date, times: Date[]): THREE.Color => {
    const timeOfDay = time.getTime();
    let dawn = times[Time.AT_Rise].getTime();
    const dusk = times[Time.Night].getTime();
    
    let sunrise = times[Time.Sunrise].getTime();
    const sunset = times[Time.Sunset].getTime();
    

    let r, g, b;
    if (timeOfDay <= sunset && timeOfDay >= sunrise) {
        r = 143;
        g = 255;
        b = 255;
    } else if (timeOfDay > sunset) {
        if (timeOfDay <= dusk) {
            const sunsetLength = dusk-sunset;
            const d = (timeOfDay-sunset)/sunsetLength;
            r = 143;
            g = 255-(d*255);
            b = 255;
            r *= 1-.7*d;
            g *= 1-.7*d;
            b *= 1-.7*d;
        } else {
            r = 143*.3;
            g = 0;
            b = 255*.3;
        }  
    } else {
        if (timeOfDay >= dawn) {
            const sunriseLength = sunrise-dawn;
            const d = (timeOfDay-dawn)/sunriseLength;
            r = 143;
            g = d*255;
            b = 255;
            r *= .4+.7*d;
            g *= .4+.7*d;
            b *= .4+.7*d;
        } else {
            r = 143*.3;
            g = 0;
            b = 255*.3;
        }
    }

    // console.log("timeOfDay="+(timeOfDay%86400000)/3600000+" sunrise="+(sunrise%86400000)/3600000+" sunset="+(sunset%86400000)/3600000);
    // console.log("r="+r+" g="+g+" b="+b);

    return new THREE.Color(r/255, g/255, b/255);
}

/* broken; Adapted from https://math.stackexchange.com/a/2598266 */
export const sunriseset = (lat: number, long: number, now: Date): number[] => {

    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor(((now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60000)) / (86400000));

    const zenith = 90.83333333333333;
    const D2R = Math.PI / 180;
    const R2D = 180 / Math.PI;

    const lh = long / 15;
    const Trise = dayOfYear + ((6 - lh) / 24);
    const Tset = dayOfYear + ((18 - lh) / 24);

    const Mrise = (0.9856 * Trise) - 3.289;
    const Mset = (0.9856 * Tset) - 3.289;

    let Lrise = Mrise + (1.916*Math.sin(Mrise*D2R)) + (0.020*Math.sin(2*Mrise*D2R)) + 282.634;
    limit(Lrise, 360);
    let Lset = Mset + (1.916*Math.sin(Mset*D2R)) + (0.020*Math.sin(2*Mset*D2R)) + 282.634;
    limit(Lset, 360);

    let RArise = R2D*Math.atan(0.91764*Math.tan(Lrise*D2R));
    limit(RArise, 360);
    let RAset = R2D*Math.atan(0.91764*Math.tan(Lset*D2R));
    limit(RAset, 360);

    const LQrise = (Math.floor(Lrise/90)) * 90;
    const RAQrise = (Math.floor(RArise/90)) * 90;
    RArise = RArise+(LQrise-RAQrise);
    RArise = RArise/15;

    const LQset = (Math.floor(Lset/90)) * 90;
    const RAQset = (Math.floor(RAset/90)) * 90;
    RAset = RAset+(LQset-RAQset);
    RAset = RAset/15;

    const SDrise = 0.39782*Math.sin(Lrise*D2R);
    const CDrise = Math.cos(Math.asin(SDrise));

    const SDset = 0.39782*Math.sin(Lset*D2R);
    const CDset = Math.cos(Math.asin(SDset));

    const CHrise = (Math.cos(zenith*D2R) - (SDrise*Math.sin(lat*D2R))) / (CDrise*Math.cos(lat*D2R));
    const CHset = (Math.cos(zenith*D2R) - (SDset*Math.sin(lat*D2R))) / (CDset*Math.cos(lat*D2R));
    const Hrise = 360 - R2D*Math.acos(CHrise);
    const Hset = R2D*Math.acos(CHset);

    const sunrise = Hrise+RArise-(0.06571*Trise)-6.622;
    const sunset = Hset+RAset-(0.06571*Tset)-6.622;

    let output = [0, 0, 0, 0, 0, 0, 0, 0]; //ATstart, NTstart, CTstart, Daystart, CTstart, NTstart, ATstart, Nightstart
    output[3] = (limit(sunrise-lh, 24)*3600000);
    output[7] = (limit(sunset-lh, 24)*3600000);

    console.log("("+lat+", "+long+")");

    // const d1 = new Date(output[3]);
    // d1.setFullYear(now.getFullYear());
    // d1.setMonth(now.getMonth());
    // d1.setDate(now.getDate());
    // const d2 = new Date(output[7]);
    // d2.setFullYear(now.getFullYear());
    // d2.setMonth(now.getMonth());
    // d2.setDate(now.getDate());
    // console.log("sunrise="+d1);
    // console.log("sunset="+d2);
    // console.log("-");

    return output;
}

function limit(n: number, l: number): number {
    if (n > l) {
        n = n-l;
    } else if (n < 0) {
        n = n+l;
    }
    return n;
}

export const getTimes = (now: Date, lat: number, long: number): Date[] => {
    const sc = SunCalc.getTimes(now, lat, long);

    const times = [sc.nightEnd, sc.nauticalDawn, sc.dawn, sc.sunrise, sc.sunset, sc.dusk, sc.nauticalDusk, sc.night];

    console.log("("+lat+", "+long+")");
    console.log(times);

    return times;
}