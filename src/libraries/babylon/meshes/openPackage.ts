import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import earcut from 'earcut';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Vector2, Mesh, PolygonMeshBuilder, PBRMaterial, Color3 } from "@babylonjs/core";
import OpenPackageScene from "../scenes/openPackageScene";

export default class OpenPackageMesh {
    public parentScene: OpenPackageScene;
    private _package_width = 6;
    private _package_depth = 2.5;
    private _lid_top_height = 3;
    private _package_height = 8;

    private _package_front_mesh!: Mesh;

    constructor(parentScene: OpenPackageScene) {
        this.parentScene = parentScene;
        this.buildMeshes();
    }

    private buildMeshes() {
        this._package_front_mesh = this.buildFrontMesh();
    }

    private buildFrontMesh(): Mesh {
        let corners = [ 
            new Vector2(-(this._package_width / 2), -(this._package_height / 2)),
            new Vector2(this._package_width / 2, -(this._package_height / 2)),
            new Vector2(this._package_width / 2, this._package_height / 2),
            new Vector2(-(this._package_width / 2), this._package_height / 2)
        ];
        return this.buildSingleMesh('front_mesh', corners);
    }

    private buildSingleMesh(meshName: string, corners: any): Mesh {
        const mesh_builder = new PolygonMeshBuilder('front_mesh', corners, this.parentScene.scene, earcut);
        return mesh_builder.build(false);
    }
}