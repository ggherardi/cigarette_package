import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import earcut from 'earcut';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Vector2, Mesh, PolygonMeshBuilder, PBRMaterial, Color3 } from "@babylonjs/core";

export default class OpenPackage {
    private _package_width = 6;
    private _package_depth = 2.5;
    private _lid_top_height = 3;
    private _package_height = 8;

    private _scene!: Scene;
    private _package_front_mesh!: Mesh;

    constructor(scene: Scene) {
        this._scene = scene;
        this.buildMeshes();
    }

    private buildMeshes() {
        this._package_front_mesh = this.buildFrontMesh();
    }

    private buildSingleMesh(meshName: string, corners: any): Mesh {
        const mesh_builder = new PolygonMeshBuilder('front_mesh', corners, this._scene, earcut);
        return mesh_builder.build(false);
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
}