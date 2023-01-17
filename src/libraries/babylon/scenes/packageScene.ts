import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Animation } from '@babylonjs/core';
import Package from './../meshes/package';
import { AdvancedDynamicTexture, Button, Control, StackPanel } from '@babylonjs/gui';
import PackageEngine from '../packageEngine';

export default class PackageScene {
    public engine!: PackageEngine;
    public scene!: Scene;
    public light!: HemisphericLight;
    public packageInstance!: Package;

    constructor(engine: PackageEngine) {
        this.engine = engine;
        this.scene = new Scene(engine.engine);
        this.defineRotateCamera('Camera', this.scene, engine.canvas);
        this.light = this.defineLight('Light1', this.scene);   
        this.packageInstance = new Package(this);
    }

    private defineRotateCamera(cameraName: string, scene: Scene, canvas: any): ArcRotateCamera {
        var camera: ArcRotateCamera = new ArcRotateCamera(cameraName, -Math.PI / 2, Math.PI / 4, 30, new Vector3(0, 0, 5), scene);
        camera.attachControl(canvas, true);          
        return camera;
    }

    private defineLight(lightName: string, scene: Scene): HemisphericLight {
        var light: HemisphericLight = new HemisphericLight(lightName, new Vector3(0, 10, 0), scene);
        light.intensity = 1;     
        return light;
    }

    private addButton() {
        let openPackageSceneButton = this.engine.addButtonToPanel('test', () => {
        });
    }

    public attachButtons() {
        this.addButton();
    }
}