import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import earcut from 'earcut';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Vector2, Mesh, PolygonMeshBuilder, PBRMaterial, Color3, ActionManager, ExecuteCodeAction, InterpolateValueAction } from "@babylonjs/core";
import OpenPackageScene from "../scenes/openPackageScene";
import Utilities from "../utilities";

export default class OpenPackageMesh {
    public parentScene: OpenPackageScene;
    private _side = { left: 'left', right: 'right'};
    private _package_width = 6;
    private _package_depth = 2.5;
    private _lid_top_height = 3;
    private _lid_extra_height = 1;
    private _package_height = 10;
    private _package_front_height = 8;
    private _open_package_white_section_height = 2;
    private _meshes_gap = 0.1;

    private _package_front_mesh!: Mesh;
    private _package_left_side_mesh!: Mesh;
    private _package_right_side_mesh!: Mesh;
    private _package_back_side_mesh!: Mesh;
    private _package_lid_front_mesh!: Mesh;
    private _package_lid_top_mesh!: Mesh;
    private _package_lid_left_side_mesh!: Mesh;
    private _package_lid_right_side_mesh!: Mesh;
    private _meshArray: Mesh[];

    constructor(parentScene: OpenPackageScene) {
        this.parentScene = parentScene;
        this._meshArray = [];
        this.buildMeshes();
        this.translateMeshes();
        this.attachEventToMeshes();
    }

    private buildMeshes() {
        this._package_front_mesh = this.buildFrontMesh();
        this._package_left_side_mesh = this.buildSideMesh(this._side.left);
        this._package_right_side_mesh = this.buildSideMesh(this._side.right);
        this._package_back_side_mesh = this.buildBackSideMesh();
        this._package_lid_front_mesh = this.buildLidFrontMesh();
        this._package_lid_left_side_mesh = this.buildLidSideMesh(this._side.left);
        this._package_lid_right_side_mesh = this.buildLidSideMesh(this._side.right);
        this._package_lid_top_mesh = this.buildLideTopMesh();        
    }

    private buildFrontMesh(): Mesh {
        let corners = [ 
            new Vector2(0, 0),
            new Vector2(this._package_width, 0),
            new Vector2(this._package_width, this._package_front_height),
            new Vector2(0, this._package_front_height)
        ];
        return this.buildSingleMesh('front_mesh', corners);
    }

    private buildSideMesh(side: any): Mesh {
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
        return this.buildSingleMesh(side == this._side.right ? 'right_side_mesh' : 'left_side_mesh', corners);
    }

    private buildBackSideMesh(): Mesh {
        let corners = [ 
            new Vector2(0, 0),
            new Vector2(this._package_width, 0),
            new Vector2(this._package_width, this._package_height + this._lid_extra_height),
            new Vector2(0, this._package_height + this._lid_extra_height)
        ];
        return this.buildSingleMesh('back_side_mesh', corners);
    }

    private buildLidFrontMesh(): Mesh {
        let corners = [ 
            new Vector2(0, 0),
            new Vector2(this._package_width, 0),
            new Vector2(this._package_width, this._lid_top_height),
            new Vector2(0, this._lid_top_height)
        ];
        return this.buildSingleMesh('lid_front_mesh', corners);
    }

    private buildLidSideMesh(side: any): Mesh {
        let isRightSide = side == this._side.right;
        let corners = [ 
            new Vector2(0, 0),
            isRightSide ? 
                new Vector2(this._package_depth, this._lid_top_height - this._lid_extra_height) :
                new Vector2(-this._package_depth, this._lid_top_height - this._lid_extra_height),
            isRightSide ?
                new Vector2(this._package_depth, this._lid_top_height) :
                new Vector2(-this._package_depth, this._lid_top_height),
            new Vector2(0, this._lid_top_height)
        ];
        return this.buildSingleMesh(isRightSide ? 'lid_right_side_mesh' : 'lid_left_side_mesh', corners);
    }

    private buildLideTopMesh(): Mesh {
        let corners = [ 
            new Vector2(0, 0),
            new Vector2(this._package_width, 0),
            new Vector2(this._package_width, this._package_depth),
            new Vector2(0, this._package_depth)
        ];
        return this.buildSingleMesh('lid_top_mesh', corners);
    }

    private translateMeshes() {
        this._package_front_mesh.translate(Utilities.Vector3.x, -this._package_width / 2);
        this._package_left_side_mesh.translate(Utilities.Vector3.x, -(this._package_width / 2) - this._package_depth - this._meshes_gap);
        this._package_right_side_mesh.translate(Utilities.Vector3.x, (this._package_width / 2) + this._meshes_gap);
        this._package_back_side_mesh.translate(Utilities.Vector3.x, (this._package_width / 2) + this._package_depth + (this._meshes_gap * 2))
        this._package_lid_front_mesh.translate(Utilities.Vector3.x, -this._package_width / 2);
        this._package_lid_front_mesh.translate(Utilities.Vector3.z, (this._package_front_height) + this._meshes_gap);
        this._package_lid_right_side_mesh.translate(Utilities.Vector3.z, (this._package_front_height) + this._meshes_gap)
        this._package_lid_right_side_mesh.translate(Utilities.Vector3.x, (this._package_width / 2) + this._meshes_gap)
        this._package_lid_left_side_mesh.translate(Utilities.Vector3.z, (this._package_front_height) + this._meshes_gap)
        this._package_lid_left_side_mesh.translate(Utilities.Vector3.x, -(this._package_width / 2) - this._meshes_gap)
        this._package_lid_top_mesh.translate(Utilities.Vector3.x, -(this._package_width / 2))
        this._package_lid_top_mesh.translate(Utilities.Vector3.z, (this._package_front_height) + (this._lid_top_height) + (this._meshes_gap * 2))
    }

    private attachEventToMeshes() {        
        for (let i = 0; i < this._meshArray.length; i++) {
            let mesh = this._meshArray[i];
            mesh.actionManager = new ActionManager(this.parentScene.scene);
            // mesh.actionManager.registerAction(
            //     new InterpolateValueAction(
            //         ActionManager.OnPickTrigger,
            //         this.parentScene.light,
            //         'diffuse',
            //         Color3.Black(),
            //         1000
            //     )
            // )
            mesh.actionManager.registerAction(new ExecuteCodeAction({ trigger: ActionManager.OnPickTrigger },
                (e) => { console.log(e); }))
        }
    }

    private buildSingleMesh(meshName: string, corners: any): Mesh {
        const mesh_builder = new PolygonMeshBuilder(meshName, corners, this.parentScene.scene, earcut);
        let mesh = mesh_builder.build(false);
        this._meshArray.push(mesh);
        return mesh;
    }
}