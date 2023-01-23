import '@babylonjs/core/Debug/debugLayer';
import '@babylonjs/inspector';
import '@babylonjs/loaders/glTF';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Animation } from '@babylonjs/core';
import PackageMesh from './meshes/package';
import { AdvancedDynamicTexture, Button, Control, StackPanel } from '@babylonjs/gui';
import OpenPackageMesh from './meshes/openPackageMesh';
import PackageScene from './scenes/packageScene';
import OpenPackageScene from './scenes/openPackageScene';
import IPackageScene from './scenes/IPackageScene';

export default class PackageEngine {
    public Scenes = {
        PackageScene: () =>  this.packageScene,
        OpenPackageScene: () => this.openPackageScene
    }

    private _packageInstance!: PackageMesh;
    private _openPackageInstance!: OpenPackageMesh;
    private static _instance: PackageEngine;

    public canvas: any;
    public buttonsPanel!: StackPanel;
    public engine!: Engine;
    public packageScene!: PackageScene;
    public openPackageScene!: OpenPackageScene;
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
        this.openPackageScene = new OpenPackageScene(this);

        // run the main render loop
        this.render(this.openPackageScene.scene);
    }    

    private render(scene: Scene) {
        this.engine.runRenderLoop(() => scene.render())
    }
    
    public changeScene(prevScene: IPackageScene, nextScene: IPackageScene) {
        this.render(nextScene.scene);
        prevScene.buttonsPanel.isVisible = false;
        nextScene.buttonsPanel.isVisible = true;
    }

    public static getInstance(imageUrl: string = '') {
        return PackageEngine._instance ? PackageEngine._instance : new PackageEngine(imageUrl);
    }

    public changeImage(newImageUrl: string) {
        this._packageInstance.changeImage(newImageUrl);
    }

}