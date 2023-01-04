import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Vector2, PolygonMeshBuilder, StandardMaterial, Texture, Color3 } from "@babylonjs/core";
import earcut from 'earcut';
import Utilities from "./utilities";

export default class OpenPackage {
    private _scene: Scene;
    private _light: HemisphericLight;

    private _rotation_90_in_radians = 1.5708;
    private _package_width = 6;
    private _package_depth = 2.5;
    private _closed_package_height = 8;
    private _open_package_white_section_height = 2;
    private _lid_top_height = 3;
    private _open_package_height = this._closed_package_height - this._open_package_white_section_height;
    private _meshes: Mesh[] = [];

    constructor(scene: Scene, light: HemisphericLight) {
        this._scene = scene;
        this._light = light;
        this.buildMeshes();
    }

    // Package front corners
    private _open_package_front_corners = [ 
        // Bottom corner
        new Vector2(-this._package_width / 2, -this._closed_package_height / 2),
        new Vector2(this._package_width / 2, -this._closed_package_height / 2),

        // Right side corner
        new Vector2((this._package_width / 2), (this._closed_package_height / 2)),

        // Left corner
        new Vector2(-this._package_width / 2, this._closed_package_height / 2)
    ];

    // White section front corners
    private _open_package_white_section_front_corners = [
        // Right side corner
        new Vector2((this._package_width / 2), (this._closed_package_height / 2)),
        new Vector2((this._package_width / 2), (this._closed_package_height / 2) + this._open_package_white_section_height),

        // Top opening
        new Vector2(2.5, (this._closed_package_height / 2) + this._open_package_white_section_height),
        new Vector2(2, 4.8),
        new Vector2(-2, 4.8),
        new Vector2(-2.5, (this._closed_package_height / 2) + this._open_package_white_section_height),
        new Vector2((-this._package_width / 2), (this._closed_package_height / 2) + this._open_package_white_section_height),

        // Left side corner
        new Vector2(-(this._package_width / 2), (this._closed_package_height / 2))
    ];

    // White section side corners
    private _open_package_white_section_side_corners = [
        new Vector2((this._package_width / 2) - this._package_depth, (this._closed_package_height / 2)),
        new Vector2((this._package_width / 2), (this._closed_package_height / 2) + this._open_package_white_section_height),
        new Vector2((this._package_width / 2) - this._package_depth, (this._closed_package_height / 2) + this._open_package_white_section_height)
    ];

    // Back corners
    private _package_back_corners = [
        // Bottom corner
        new Vector2(-this._package_width / 2, -this._closed_package_height / 2),
        new Vector2(this._package_width / 2, -this._closed_package_height / 2),

        // Right side corner
        new Vector2((this._package_width / 2), (this._closed_package_height / 2) + this._open_package_white_section_height),

        // Top corner
        new Vector2(-this._package_width / 2, (this._closed_package_height / 2) + this._open_package_white_section_height),
    ];    

    // Base corners
    private _package_base_corners = [ 
        new Vector2(-(this._package_width / 2), (-this._closed_package_height / 2)),
        new Vector2((this._package_width / 2), (-this._closed_package_height / 2)),
        new Vector2((this._package_width / 2), (-(this._closed_package_height / 2)) + this._package_depth),
        new Vector2(-(this._package_width / 2), (-(this._closed_package_height / 2)) + this._package_depth)
    ];

    // Package left side corners
    private _package_left_side_corners = [ 
        new Vector2(0, -(this._closed_package_height / 2)),
        new Vector2(-this._package_depth, (-this._closed_package_height / 2)),
        new Vector2(-this._package_depth, this._open_package_height),
        new Vector2(0, this._open_package_height - this._open_package_white_section_height)
    ];

    // Package right side corners
    private _package_right_side_corners = [ 
        new Vector2(0, (-this._closed_package_height / 2)),
        new Vector2(this._package_depth, -(this._closed_package_height / 2)),
        new Vector2(this._package_depth, this._open_package_height),
        new Vector2(0, this._open_package_height - this._open_package_white_section_height)
    ];

    // Lid right side
    private _package_lid_right_side_corners = [ 
        new Vector2((this._package_width / 2) - this._package_depth, (this._closed_package_height / 2)),
        new Vector2((this._package_width / 2), (this._closed_package_height / 2) + this._open_package_white_section_height),
        new Vector2((this._package_width / 2), (this._closed_package_height / 2) + this._lid_top_height),
        new Vector2((this._package_width / 2) - this._package_depth, (this._closed_package_height / 2) + this._lid_top_height)
    ];

    // Lid left side
    private _package_lid_left_side_corners = [ 
        new Vector2(-(this._package_width / 2) + this._package_depth, (this._closed_package_height / 2)),
        new Vector2(-(this._package_width / 2), (this._closed_package_height / 2) + this._open_package_white_section_height),
        new Vector2(-(this._package_width / 2), (this._closed_package_height / 2) + this._lid_top_height),
        new Vector2(-(this._package_width / 2) + this._package_depth, (this._closed_package_height / 2) + this._lid_top_height)
    ];

    // Lid back cover
    private _package_lid_back_cover_corners = [ 
        new Vector2(-(this._package_width / 2), this._open_package_height),
        new Vector2((this._package_width / 2), this._open_package_height),
        new Vector2((this._package_width / 2), (this._open_package_height + this._package_depth)),
        new Vector2(-(this._package_width / 2), (this._open_package_height + this._package_depth))
    ];
    
    // Lid top cover
    private _package_lid_top_cover_corners = [ 
        new Vector2(-(this._package_width / 2), 0),
        new Vector2((this._package_width / 2), 0),
        new Vector2((this._package_width / 2), this._lid_top_height),
        new Vector2(-(this._package_width / 2), this._lid_top_height)
    ];

    // Lid bottom cover
    private _package_lid_bottom_cover_corners = [ 
        new Vector2(-(this._package_width / 2), 0),
        new Vector2((this._package_width / 2), 0),
        new Vector2((this._package_width / 2), 1),
        new Vector2(-(this._package_width / 2), 1)
    ];

    private buildRoundSection() {
        // Package top side rounding function, WIP
        let open_package_top_round_corners = [];
        let j = 2.5;
        const increment = 0.1;
        const numberOfPoints = 20;

        for(let i = 1; i < 1.5; i += increment) {        
            let nextPoint = Math.abs((Math.log10(i + increment) - Math.log10(i)) - (Math.log10(i + increment * 2) - Math.log10(i + increment))) * 10; 
            console.log(nextPoint);
            open_package_top_round_corners.push(new Vector2(j, this._open_package_height - nextPoint));
            j += increment;
        }
        console.log(open_package_top_round_corners);     
    }

    private makeInsideMesh(mesh: Mesh, flipNormals: boolean = false) {
        let insideMesh = mesh.clone();
        insideMesh.makeGeometryUnique()
        mesh.flipFaces(flipNormals);
    }

    private buildMeshes() {
        // Front        
        const open_package_bottom_front = new PolygonMeshBuilder('open_package_bottom_front', this._open_package_front_corners, this._scene, earcut);
        const open_package_bottom_front_mesh: Mesh = open_package_bottom_front.build(false);
        open_package_bottom_front_mesh.flipFaces();
        this.makeInsideMesh(open_package_bottom_front_mesh);
        this._meshes.push(open_package_bottom_front_mesh);        

        // White section
        const open_package_front_white_section = new PolygonMeshBuilder('open_package_front_white_section', this._open_package_white_section_front_corners, this._scene, earcut);
        const open_package_front_white_section_mesh = open_package_front_white_section.build(false);
        this.makeInsideMesh(open_package_front_white_section_mesh);
        // this._meshs.push(open_package_bottom_front_mesh);

        // White section right side
        const open_package_white_section_side = new PolygonMeshBuilder('open_package_white_section_side', this._open_package_white_section_side_corners, this._scene, earcut);
        const open_package_white_section_right_side_mesh = open_package_white_section_side.build(false);
        open_package_white_section_right_side_mesh.rotate(Utilities.Vector3.z, -this._rotation_90_in_radians);
        open_package_white_section_right_side_mesh.translate(Utilities.Vector3.x, -0.5);
        open_package_white_section_right_side_mesh.translate(Utilities.Vector3.y, this._package_width / 2);
        this.makeInsideMesh(open_package_white_section_right_side_mesh);

        // White section left side
        const open_package_white_section_left_side_mesh = open_package_white_section_side.build(false);
        open_package_white_section_left_side_mesh.rotate(Utilities.Vector3.z, -this._rotation_90_in_radians);
        open_package_white_section_left_side_mesh.translate(Utilities.Vector3.x, -0.5);
        open_package_white_section_left_side_mesh.translate(Utilities.Vector3.y, -(this._package_width / 2));
        open_package_white_section_left_side_mesh.flipFaces();
        this.makeInsideMesh(open_package_white_section_left_side_mesh);

        // Back
        const open_package_bottom_back = new PolygonMeshBuilder('open_package_bottom_back', this._package_back_corners, this._scene, earcut);
        const open_package_bottom_back_mesh = open_package_bottom_back.build(false);
        open_package_bottom_back_mesh.translate(Utilities.Vector3.y, -this._package_depth);
        this.makeInsideMesh(open_package_bottom_back_mesh);
        this._meshes.push(open_package_bottom_back_mesh);

        // Base
        const open_package_base = new PolygonMeshBuilder('open_package_bottom_side', this._package_base_corners, this._scene, earcut);
        const open_package_base_mesh = open_package_base.build(false);
        open_package_base_mesh.rotate(Utilities.Vector3.x, -this._rotation_90_in_radians);
        open_package_base_mesh.translate(Utilities.Vector3.y, this._closed_package_height / 2);
        open_package_base_mesh.translate(Utilities.Vector3.z, 1.5);
        open_package_base_mesh.flipFaces();
        this.makeInsideMesh(open_package_base_mesh);
        this._meshes.push(open_package_base_mesh);

        // Left side
        const open_package_bottom_left_side = new PolygonMeshBuilder('open_package_bottom_left_side', this._package_left_side_corners, this._scene, earcut);
        const open_package_bottom_left_side_mesh = open_package_bottom_left_side.build(false);
        open_package_bottom_left_side_mesh.rotate(Utilities.Vector3.z, this._rotation_90_in_radians);
        open_package_bottom_left_side_mesh.translate(Utilities.Vector3.y, this._package_width / 2);
        open_package_bottom_left_side_mesh.flipFaces();
        this.makeInsideMesh(open_package_bottom_left_side_mesh);
        this._meshes.push(open_package_bottom_left_side_mesh);

        // Right side
        const open_package_bottom_right_side = new PolygonMeshBuilder('open_package_bottom_right_side', this._package_right_side_corners, this._scene, earcut);
        const open_package_bottom_right_side_mesh = open_package_bottom_right_side.build(false);
        open_package_bottom_right_side_mesh.rotate(Utilities.Vector3.z, -this._rotation_90_in_radians);
        open_package_bottom_right_side_mesh.translate(Utilities.Vector3.y, this._package_width / 2);
        open_package_bottom_right_side_mesh.flipFaces();
        this.makeInsideMesh(open_package_bottom_right_side_mesh);
        this._meshes.push(open_package_bottom_right_side_mesh);

        // Lid right side
        const lid_right_side = new PolygonMeshBuilder('lid_right_side', this._package_lid_right_side_corners, this._scene, earcut);
        const lid_right_side_mesh = lid_right_side.build(false);
        lid_right_side_mesh.rotate(Utilities.Vector3.z, -this._rotation_90_in_radians);
        lid_right_side_mesh.translate(Utilities.Vector3.x, -3.5);
        lid_right_side_mesh.translate(Utilities.Vector3.z, this._closed_package_height + 1);
        lid_right_side_mesh.translate(Utilities.Vector3.y, (this._package_width / 2));
        lid_right_side_mesh.rotate(Utilities.Vector3.y, this._rotation_90_in_radians);
        lid_right_side_mesh.flipFaces();
        this.makeInsideMesh(lid_right_side_mesh);
        this._meshes.push(lid_right_side_mesh);

        // Lid left side
        const lid_left_side = new PolygonMeshBuilder('lid_left_side', this._package_lid_left_side_corners, this._scene, earcut);
        const lid_left_side_mesh = lid_left_side.build(false);
        lid_left_side_mesh.rotate(Utilities.Vector3.z, this._rotation_90_in_radians);
        lid_left_side_mesh.translate(Utilities.Vector3.x, 3.5);
        lid_left_side_mesh.translate(Utilities.Vector3.z, this._closed_package_height + 1);
        lid_left_side_mesh.translate(Utilities.Vector3.y, (this._package_width / 2));
        lid_left_side_mesh.rotate(Utilities.Vector3.y, -this._rotation_90_in_radians);
        lid_left_side_mesh.flipFaces();
        this.makeInsideMesh(lid_left_side_mesh);
        this._meshes.push(lid_left_side_mesh);

        // Lid back cover
        const lid_back_cover = new PolygonMeshBuilder('lid_back_cover', this._package_lid_back_cover_corners, this._scene, earcut);
        const lid_back_cover_mesh = lid_back_cover.build(false);
        lid_back_cover_mesh.translate(Utilities.Vector3.y, -(this._package_depth) - 1);
        this.makeInsideMesh(lid_back_cover_mesh);
        this._meshes.push(lid_back_cover_mesh);        

        // Lid top cover
        const _package_lid_top_cover = new PolygonMeshBuilder('lid_top_cover', this._package_lid_top_cover_corners, this._scene, earcut);
        const _package_lid_top_cover_mesh = _package_lid_top_cover.build(false);
        _package_lid_top_cover_mesh.rotate(Utilities.Vector3.x, this._rotation_90_in_radians);
        _package_lid_top_cover_mesh.translate(Utilities.Vector3.y, (this._open_package_height / 2) + this._lid_top_height + this._open_package_white_section_height + ((this._lid_top_height - this._open_package_white_section_height) / 2));
        _package_lid_top_cover_mesh.translate(Utilities.Vector3.z, 0.5);
        _package_lid_top_cover_mesh.flipFaces();
        this.makeInsideMesh(_package_lid_top_cover_mesh);
        this._meshes.push(_package_lid_top_cover_mesh);        

        // Lid bottom cover
        const _package_lid_bottom_cover = new PolygonMeshBuilder('lid_bottom_cover', this._package_lid_bottom_cover_corners, this._scene, earcut);
        const _package_lid_bottom_cover_mesh = _package_lid_bottom_cover.build(false);
        _package_lid_bottom_cover_mesh.rotate(Utilities.Vector3.x, this._rotation_90_in_radians);
        _package_lid_bottom_cover_mesh.translate(Utilities.Vector3.z, this._package_depth);
        _package_lid_bottom_cover_mesh.translate(Utilities.Vector3.y, this._open_package_height);
        this.makeInsideMesh(_package_lid_bottom_cover_mesh);
        this._meshes.push(_package_lid_bottom_cover_mesh);    
        
        
        // Creating standard material with texture
        var mat = new StandardMaterial("mat", this._scene);
        // Removing reflection from material
        mat.specularColor = new Color3(0, 0, 0);
        var texture = new Texture("https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1600", this._scene);
        // var texture = new Texture("https://i.redd.it/4ydswzeokxp81.jpg", this._scene);
        mat.diffuseTexture = texture;

        var mat2 = new StandardMaterial("mat2", this._scene);
        // Removing reflection from material
        mat2.specularColor = new Color3(0, 0, 0);
        mat2.diffuseTexture = new Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/A_black_image.jpg/640px-A_black_image.jpg", this._scene);
        // mat2.diffuseColor = new Color3(100, 100, 255);
        lid_right_side_mesh.material = mat2;

        for(let i = 0; i < this._meshes.length; i++) {
            let mesh: Mesh = this._meshes[i];
            mesh.material = mat;            
        }
    }

    public getPolygons() {
        return this._meshes;
    }
}