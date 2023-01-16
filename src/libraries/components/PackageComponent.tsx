import * as React from 'react';
import PackageScene from '../babylon/packageScene';

export interface IPackageComponentProps {
    imageUrl?: string;
    isOpenPackage?: boolean;
    onChangeImage?: any;
}

export default class PackageComponent extends React.Component<IPackageComponentProps, {}> {
    private _packageScene: PackageScene;

    constructor(props: IPackageComponentProps) {
        super(props);
        this._packageScene = PackageScene.getInstance(this.props.imageUrl);
    }

    componentDidUpdate(prevProps: IPackageComponentProps) {
        this._packageScene.changeImage(this.props.imageUrl ? this.props.imageUrl : '');
    }

    public render(): React.ReactElement<PackageComponent> {
        return (
            <div>        
            </div>
        );
    }
}
