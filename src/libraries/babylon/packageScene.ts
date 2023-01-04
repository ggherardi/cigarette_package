import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight } from "@babylonjs/core";
import OpenPackage from "./openPackage";
// import OpenPackage from './openPackage'

export default class PackageScene {
    private _openPackageInstance: OpenPackage;

    constructor(imageUrl: string = '') {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "package_canvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);

        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 30, new Vector3(0, 0, 5), scene);
        camera.attachControl(canvas, true);
        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(0, 10, 0), scene);
        light1.intensity = 1;       

        // Package builder
        this._openPackageInstance = new OpenPackage(scene, light1, imageUrl);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    public changeImage(newImageUrl: string) {
        this._openPackageInstance.changeImage(newImageUrl);
    }
}