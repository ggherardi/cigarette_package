import { Vector3 } from "@babylonjs/core";

export default class Utilities {
    public static clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    public static Vector3 = {
        x: new Vector3(1, 0, 0),
        y: new Vector3(0, 1, 0),
        z: new Vector3(0, 0, 1)
    }
}