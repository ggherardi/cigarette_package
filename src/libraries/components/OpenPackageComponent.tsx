import * as React from 'react';
import PackageScene from '../babylon/packageScene';

export interface IOpenPackageComponentProps {
    image?: string;
}

export default class OpenPackageComponent extends React.Component<IOpenPackageComponentProps, {}> {
    constructor(props: IOpenPackageComponentProps) {
        super(props);
        new PackageScene('https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1600');
    }

    public render(): React.ReactElement<OpenPackageComponent> {
    return (
        <div className='card-body px-4'>
        
        </div>
    );}
}
