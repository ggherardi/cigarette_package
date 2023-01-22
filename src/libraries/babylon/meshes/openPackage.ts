import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import earcut from 'earcut';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Vector2, Mesh, PolygonMeshBuilder, PBRMaterial, Color3 } from "@babylonjs/core";
import OpenPackageScene from "../scenes/openPackageScene";
import Utilities from "../utilities";

export default class OpenPackageMesh {
    public parentScene: OpenPackageScene;
    private _side = { left: 'left', right: 'right'};
    private _package_width = 6;
    private _package_depth = 2.5;
    private _lid_top_height = 3;
    private _package_height = 10;
    private _package_front_height = 8;
    private _open_package_white_section_height = 2;
    private _open_package_height = this._package_height - this._open_package_white_section_height;

    private _package_front_mesh!: Mesh;
    private _package_left_side_mesh!: Mesh;
    private _package_right_side_mesh!: Mesh;

    constructor(parentScene: OpenPackageScene) {
        this.parentScene = parentScene;
        this.buildMeshes();
    }

    private buildMeshes() {
        this._package_front_mesh = this.buildFrontMesh();
        this._package_left_side_mesh = this.buildSideMesh(-(this._package_width / 2) - this._package_depth - 1, this._side.left);
        this._package_right_side_mesh = this.buildSideMesh((this._package_width / 2) + 1, this._side.right);
    }

    private buildFrontMesh(): Mesh {
        let corners = [ 
            new Vector2(0, 0),
            new Vector2(this._package_width, 0),
            new Vector2(this._package_width, this._package_front_height),
            new Vector2(0, this._package_front_height)
        ];
        let mesh: Mesh = this.buildSingleMesh('front_mesh', corners);
        mesh.translate(Utilities.Vector3.x, -this._package_width / 2);
        return mesh;
    }

    private buildSideMesh(translationDistance: number, side: any): Mesh {
        let isRightSide = side == this._side.right;
        let corners = [ 
            new Vector2(0, 0),
            new Vector2(this._package_depth, 0),
            isRightSide ? 
                new Vector2(this._package_depth, this._package_height) : 
                new Vector2(this._package_depth, this._package_front_height),
            isRightSide ?
                new Vector2(0, this._package_front_height) :
                new Vector2(0, this._package_height)
        ];
        let mesh: Mesh = this.buildSingleMesh('right_side_mesh', corners);
        mesh.translate(Utilities.Vector3.x, translationDistance);
        return mesh;
    }

    private buildSingleMesh(meshName: string, corners: any): Mesh {
        const mesh_builder = new PolygonMeshBuilder('front_mesh', corners, this.parentScene.scene, earcut);
        return mesh_builder.build(false);
    }
}