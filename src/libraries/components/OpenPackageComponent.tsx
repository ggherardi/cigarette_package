import * as React from 'react';
import PackageScene from '../babylon/packageScene';

export interface IOpenPackageComponentProps {
    imageUrl?: string;
    onChangeImage?: any;
}

export default class OpenPackageComponent extends React.Component<IOpenPackageComponentProps, {}> {
    private _packageScene: PackageScene;

    constructor(props: IOpenPackageComponentProps) {
        super(props);
        this._packageScene = PackageScene.getInstance(this.props.imageUrl);
    }

    componentDidUpdate(prevProps: IOpenPackageComponentProps) {
        this._packageScene.changeImage(this.props.imageUrl ? this.props.imageUrl : '');
    }

    public render(): React.ReactElement<OpenPackageComponent> {
        return (
            <div>        
            </div>
        );
    }
}
