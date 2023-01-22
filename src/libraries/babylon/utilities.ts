import { Mesh, Vector3 } from "@babylonjs/core";
import { Button, StackPanel } from "@babylonjs/gui";

export default class Utilities {
    public static clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

    public static Vector3 = {
        x: new Vector3(1, 0, 0),
        y: new Vector3(0, 1, 0),
        z: new Vector3(0, 0, 1)
    }

    // public static rotateMesh180(mesh: Mesh) {
    //     mesh.rotate(this.Vector3.z, 1);
    // }

    public static addButtonToPanel(text: string, stackPanel: StackPanel, callback: any) {
        var button = Button.CreateSimpleButton('button', text);
        button.top = '-100px';
        button.width = '140px';
        button.height = '40px';
        button.color = 'white';
        button.background = 'green';
        button.paddingLeft = '10px';
        button.paddingRight = '10px';
        button.onPointerUpObservable.add(function () {
            callback()
        });
        stackPanel.addControl(button);
        return button;
    }
}