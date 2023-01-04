import * as React from 'react';
import OpenPackageComponent from './OpenPackageComponent';

export interface IMainComponentProps {
    image?: string;
}

export default class MainComponent extends React.Component<IMainComponentProps, {}> {    

    componentDidMount() {
    }

    public render(): React.ReactElement<MainComponent> {
    return (
        <div className='card-body px-4'>
            <OpenPackageComponent></OpenPackageComponent>
        </div>
    );}
}
