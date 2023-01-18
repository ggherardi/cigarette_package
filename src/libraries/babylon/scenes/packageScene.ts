import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Animation } from '@babylonjs/core';
import PackageMesh from './../meshes/package';
import { AdvancedDynamicTexture, Button, Control, StackPanel } from '@babylonjs/gui';
import PackageEngine from '../packageEngine';
import Utilities from '../utilities';
import IPackageScene from './IPackageScene';

export default class PackageScene implements IPackageScene {
    public engine!: PackageEngine;
    public scene!: Scene;
    public light!: HemisphericLight;
    public mesh!: PackageMesh;
    public buttonsPanel!: StackPanel;

    constructor(engine: PackageEngine) {
        this.engine = engine;
        this.scene = new Scene(engine.engine);
        this.defineRotateCamera('Camera', this.scene, engine.canvas);
        this.light = this.defineLight('Light1', this.scene);   
        this.mesh = new PackageMesh(this);
        this.createButtonsGUI();
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

    public activateButtons() {
        this.buttonsPanel.isVisible = true;
    }

    private createButtonsGUI() {
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
        this.buttonsPanel = new StackPanel();
        this.buttonsPanel.isVertical = true;
        this.buttonsPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;            
        advancedTexture.addControl(this.buttonsPanel);
        Utilities.addButtonToPanel("Go to openpackage", this.buttonsPanel, () => { 
            this.engine.changeScene(this, this.engine.openPackageScene);
         });
        let animationButton = Utilities.addButtonToPanel("Chiudi", this.buttonsPanel, () => {
            const endAnimationCallback = () => {
                const tempStartingPosition = this.mesh.animation.startingPosition;
                this.mesh.animation.startingPosition = this.mesh.animation.rotation;
                this.mesh.animation.rotation = tempStartingPosition;
                animationButton.isEnabled = true;
            }
            Animation.CreateAndStartAnimation('anim', this.mesh.animation.mesh, 'rotation.x', this.mesh.animation.frameRate, this.mesh.animation.frameRate, this.mesh.animation.startingPosition, this.mesh.animation.rotation, 0, undefined, endAnimationCallback);
            if (animationButton.textBlock) {
                animationButton.textBlock.text = animationButton.textBlock.text === "Apri" ? "Chiudi" : "Apri";
            }
            animationButton.isEnabled = false;
        });        
    }
}