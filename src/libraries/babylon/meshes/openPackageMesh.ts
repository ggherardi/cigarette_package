import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import earcut from 'earcut';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Vector2, Mesh, PolygonMeshBuilder, PBRMaterial, Color3, ActionManager, ExecuteCodeAction, InterpolateValueAction, ActionEvent, StandardMaterial, Texture } from "@babylonjs/core";
import OpenPackageScene from "../scenes/openPackageScene";
import Utilities from "../utilities";

export default class OpenPackageMesh {
    public parentScene: OpenPackageScene;
    public meshesTextures: any;
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
        
        let material = new StandardMaterial(`new_material`, this.parentScene.scene);                         
        // Removing reflection from material
        material.specularColor = new Color3(0, 0, 0);                    
        // material.diffuseTexture = new Texture(`data:${file.name}`, this.parentScene.scene, true, true, Texture.BILINEAR_SAMPLINGMODE, () => console.log("Success"), (w) => console.log("Error!", e), buffer, false);
        material.emissiveColor = new Color3(1, 0, 0);
        // material.diffuseTexture = new Texture('../../assets/images/6853dd80301a7b20b31a2cfa35c0e9d3.jpg', this.parentScene.scene);    
        this._package_front_mesh.material = material;
        this._package_left_side_mesh.material = material;
        this._package_right_side_mesh.material = material;
        this._package_back_side_mesh.material = material;
        this._package_lid_front_mesh.material = material;
        this._package_lid_left_side_mesh.material = material;
        this._package_lid_right_side_mesh.material = material;
        this._package_lid_top_mesh.material = material;
    }

    private buildMeshes() {
        this._package_front_mesh = this.buildFrontMesh();
        this._package_left_side_mesh = this.buildSideMesh(this._side.left);
        this._package_right_side_mesh = this.buildSideMesh(this._side.right);
        this._package_back_side_mesh = this.buildBackSideMesh();
        this._package_lid_front_mesh = this.buildLidFrontMesh();
        this._package_lid_left_side_mesh = this.buildLidSideMesh(this._side.left);
        this._package_lid_right_side_mesh = this.buildLidSideMesh(this._side.right);
        this._package_lid_top_mesh = this.buildLidTopMesh();    
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

    private buildLidTopMesh(): Mesh {
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
            mesh.actionManager.registerAction(new ExecuteCodeAction({ trigger: ActionManager.OnPickTrigger }, (e) => this.openModalForMesh(mesh)))
        }
    }

    private openModalForMesh(mesh: Mesh) {
        console.log(mesh);
        let anyWindow: any = window; 
        let modalElement = document.getElementById("exampleModal");
        if (!modalElement) {
            return;
        }
        let modal = new anyWindow.bootstrap.Modal(modalElement);        
        modalElement.addEventListener('shown.bs.modal', () => {
            let input: HTMLInputElement = document.getElementById("fileupload") as HTMLInputElement;
            if (input) {
                input.onchange = async (e: Event) => { 
                    console.log(e, mesh); 
                    let target: HTMLInputElement = e.target as HTMLInputElement;
                    if (target) {
                        let files = target.files;
                        if (files?.length) {
                            let file = files[0];                        
                            let buffer = await file.arrayBuffer();                                
                            let material = new StandardMaterial(`${mesh.name}_material`, this.parentScene.scene);                         
                            // Removing reflection from material
                            // material.specularColor = new Color3(0, 0, 0);                    
                            // material.diffuseTexture = new Texture(`data:${file.name}`, this.parentScene.scene, true, true, Texture.BILINEAR_SAMPLINGMODE, () => console.log("Success"), (w) => console.log("Error!", e), buffer, false);
                            material.diffuseTexture = new Texture('../../assets/images/6853dd80301a7b20b31a2cfa35c0e9d3.jpg', this.parentScene.scene);
                            mesh.material = material;
                        }                        
                    }                    
           
                }
            }            
        });
        modal.show();
    }

    private buildSingleMesh(meshName: string, corners: any): Mesh {
        const mesh_builder = new PolygonMeshBuilder(meshName, corners, this.parentScene.scene, earcut);
        let mesh = mesh_builder.build(false);
        this._meshArray.push(mesh);
        return mesh;
    }
}