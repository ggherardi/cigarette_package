import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Animation } from '@babylonjs/core';
import { AdvancedDynamicTexture, Button, Control, StackPanel } from '@babylonjs/gui';
import PackageEngine from '../packageEngine';
import OpenPackageMesh from '../meshes/openPackage';
import Utilities from '../utilities';
import IPackageScene from './IPackageScene';

export default class OpenPackageScene implements IPackageScene {
    public engine!: PackageEngine;
    public scene!: Scene;
    public light!: HemisphericLight;
    public mesh!: OpenPackageMesh;
    public buttonsPanel!: StackPanel;

    constructor(engine: PackageEngine) {
        this.engine = engine;
        this.scene = new Scene(engine.engine);
        this.defineStaticCamera('Camera', this.scene, engine.canvas);
        this.mesh = new OpenPackageMesh(this);
        this.createButtonsGUI();
    }

    private defineStaticCamera(cameraName: string, scene: Scene, canvas: any): ArcRotateCamera {
        let camera = new ArcRotateCamera(cameraName, -Math.PI / 2, 0, 30, new Vector3(0, 0, 5), scene);
        return camera;
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
        Utilities.addButtonToPanel("Go to package", this.buttonsPanel, () => { 
            this.engine.changeScene(this, this.engine.packageScene);
         });    
    }
}