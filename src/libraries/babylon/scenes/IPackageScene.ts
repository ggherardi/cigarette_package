import { Scene } from "@babylonjs/core";
import { StackPanel } from "@babylonjs/gui";
import IPackageMesh from "../meshes/IPackageMesh";
import PackageEngine from "../packageEngine";

export default interface IPackageScene {
    engine: PackageEngine;
    scene: Scene;
    mesh: IPackageMesh;
    buttonsPanel: StackPanel;
}