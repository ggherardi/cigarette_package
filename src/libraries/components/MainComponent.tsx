import * as React from 'react';
import PackageComponent from './PackageComponent';

export interface IMainComponentProps {
    image?: string;
}

export interface IMainComponentState {
    isLoading?: boolean;
    isOpenPackage?: boolean;
    imageUrl?: string;
}

export default class MainComponent extends React.Component<IMainComponentProps, IMainComponentState> {    
    private image1: string;
    private image2: string;
    private switch: boolean;

    constructor(props: IMainComponentProps) {
        super(props);
        this.state = {
            isLoading: true,
            imageUrl: ''
        }
        this.switch = false;
        this.image1 = require('../../assets/images/124235523451.webp');
        this.image2 = require('../../assets/images/6853dd80301a7b20b31a2cfa35c0e9d3.jpg');
    }

    async componentDidMount() {        
        this.setState({ imageUrl: this.image1, isLoading: false });
    }

    private async changeImage(imageUrl: string) {
        let img = this.switch ? this.image1 : this.image2;
        this.switch = !this.switch;
        this.setState({ imageUrl: img });
    }

    private async openPackageForUpload() {
        this.setState({ isOpenPackage: !this.state.isOpenPackage });
    }

    public render(): React.ReactElement<MainComponent> {
        return (
            <div className='card-body px-4' style={{textAlign: 'center'}}>
                <h1>WORK IN PROGRESS!</h1>
                {!this.state.isLoading && (<PackageComponent imageUrl={this.state.imageUrl}></PackageComponent>)}
            </div>
        );
    }
}
