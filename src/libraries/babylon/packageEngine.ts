import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Animation } from '@babylonjs/core';
import Package from './meshes/package';
import { AdvancedDynamicTexture, Button, Control, StackPanel } from '@babylonjs/gui';
import OpenPackage from './meshes/openPackage';
import PackageScene from './scenes/packageScene';

export default class PackageEngine {
    public Scenes = {
        PackageScene: () =>  this.packageScene,
        OpenPackageScene: () => this.openPackageScene
    }

    private _packageInstance!: Package;
    private _openPackageInstance!: OpenPackage;
    private static _instance: PackageEngine;

    public canvas: any;
    public buttonsPanel!: StackPanel;
    public engine!: Engine;
    public packageScene!: PackageScene;
    public openPackageScene!: Scene;
    public imageUrl: string;

    constructor(imageUrl: string = '') {
        PackageEngine._instance = this; 

        // create the canvas html element and attach it to the webpage, I can play with width and height to render it better
        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.touchAction = 'auto';
        this.canvas.id = 'package_canvas';
        document.body.appendChild(this.canvas);

        this.imageUrl = imageUrl;

        // initialize babylon scene and engine
        this.engine = new Engine(this.canvas, true);
        this.packageScene = new PackageScene(this);
        this.createOpenPackageScene();

        // buttons
        this.createButtonsGUI();
        this.packageScene.attachButtons();

        // run the main render loop
        this.render(this.openPackageScene);
    }

    private createOpenPackageScene() {
        this.openPackageScene = new Scene(this.engine);
        this.defineStaticCamera('OpenPackageCamera', this.openPackageScene, this.canvas);
        this._openPackageInstance = new OpenPackage(this.openPackageScene);
        this.createButtonsGUI();
    }

    private defineStaticCamera(cameraName: string, scene: Scene, canvas: any): ArcRotateCamera {
        let camera = new ArcRotateCamera(cameraName, -Math.PI / 2, 0, 30, new Vector3(0, 0, 5), scene);
        return camera;
    }

    private defineLight(lightName: string, scene: Scene): HemisphericLight {
        var light: HemisphericLight = new HemisphericLight(lightName, new Vector3(0, 10, 0), scene);
        light.intensity = 1;     
        return light;
    }

    private render(scene: Scene) {
        this.engine.runRenderLoop(() => scene.render())
    }

    private createButtonsGUI() {
        // Buttons
        let engineInstance = this;
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
        this.buttonsPanel = new StackPanel();
        this.buttonsPanel.isVertical = true;
        this.buttonsPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;            
        advancedTexture.addControl(this.buttonsPanel);

        let instance = this;
        let openPackageSceneButton = this.addButtonToPanel('Carica immagini', () => {
            instance.changeScene(instance.openPackageScene);
        });

        let packageSceneButton = this.addButtonToPanel('Visualizza pacchetto', () => {
            instance.changeScene(instance.packageScene.scene);
        });
    }

    public addButtonToPanel(text: string, callback: any) {
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
        this.buttonsPanel.addControl(button);
        return button;
    }

    public changeScene(scene: Scene) {
        this.render(scene);
    }

    public static getInstance(imageUrl: string = '') {
        return PackageEngine._instance ? PackageEngine._instance : new PackageEngine(imageUrl);
    }

    public changeImage(newImageUrl: string) {
        this._packageInstance.changeImage(newImageUrl);
    }

}