import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Animation } from '@babylonjs/core';
import Package from './package';
import { AdvancedDynamicTexture, Button, Control, StackPanel } from '@babylonjs/gui';
import OpenPackage from './meshes/openPackage';

export default class PackageScene {
    public Scenes = {
        PackageScene: () =>  this._packageScene,
        OpenPackageScene: () => this._openPackageScene
    }

    private _canvas: any;
    private _packageInstance!: Package;
    private _openPackageInstance!: OpenPackage;
    private static _instance: PackageScene;
    private _engine!: Engine;
    private _packageScene!: Scene;
    private _openPackageScene!: Scene;
    private _imageUrl: string;

    constructor(imageUrl: string = '') {
        PackageScene._instance = this; 

        // create the canvas html element and attach it to the webpage
        this._canvas = document.createElement('canvas');
        this._canvas.style.width = '100%';
        this._canvas.style.height = '100%';
        this._canvas.style.touchAction = 'auto';
        this._canvas.id = 'package_canvas';
        document.body.appendChild(this._canvas);

        this._imageUrl = imageUrl;

        // initialize babylon scene and engine
        this._engine = new Engine(this._canvas, true);
        this.createPackageScene();
        this.createOpenPackageScene();

        // run the main render loop
        this.render(this._openPackageScene);
    }

    private createPackageScene() {
        this._packageScene = new Scene(this._engine);
        this.defineRotateCamera('Camera', this._packageScene, this._canvas);
        let light = this.defineLight('Light1', this._packageScene);   
        this._packageInstance = new Package(this._packageScene, light, this._imageUrl);    
        this.createButtonsGUI();
    }

    private createOpenPackageScene() {
        this._openPackageScene = new Scene(this._engine);
        this.defineStaticCamera('OpenPackageCamera', this._openPackageScene, this._canvas);
        this._openPackageInstance = new OpenPackage(this._openPackageScene);
        this.createButtonsGUI();
    }

    private defineRotateCamera(cameraName: string, scene: Scene, canvas: any): ArcRotateCamera {
        var camera: ArcRotateCamera = new ArcRotateCamera(cameraName, -Math.PI / 2, Math.PI / 4, 30, new Vector3(0, 0, 5), scene);
        camera.attachControl(canvas, true);          
        return camera;
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
        this._engine.runRenderLoop(() => scene.render())
    }

    private createButtonsGUI() {
        // Buttons
        var advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
        var panel = new StackPanel();
        panel.isVertical = true;
        panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;            
        advancedTexture.addControl(panel);
        var addButton = function (text: string, callback: any) {
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
            panel.addControl(button);
            return button;
        }

        let instance = this;
        let openPackageSceneButton = addButton('buttonSwitchSceneToUploadImages', () => {
            instance.changeScene(instance._openPackageScene);
        });

        let packageSceneButton = addButton('buttonSwitchSceneToPackage', () => {
            instance.changeScene(instance._packageScene);
        });
            
        // let uploadImage = addButton('Carica immagine', function () {
            
        // });
        // uploadImage.isEnabled = false;
    }

    public changeScene(scene: Scene) {
        this.render(scene);
    }

    public static getInstance(imageUrl: string = '') {
        return PackageScene._instance ? PackageScene._instance : new PackageScene(imageUrl);
    }

    public changeImage(newImageUrl: string) {
        this._packageInstance.changeImage(newImageUrl);
    }

}