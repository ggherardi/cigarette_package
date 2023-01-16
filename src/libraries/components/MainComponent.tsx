import * as React from 'react';
import PackageComponent from './PackageComponent';

export interface IMainComponentProps {
    image?: string;
}

export interface IMainComponentState {
    imageUrl?: string;
}

export default class MainComponent extends React.Component<IMainComponentProps, IMainComponentState> {    
    private image1: string;
    private image2: string;
    private switch: boolean;

    constructor(props: IMainComponentProps) {
        super(props);
        this.state = {
            imageUrl: ''
        }
        this.switch = false;
        this.image1 = require('../../assets/images/124235523451.webp');
        this.image2 = require('../../assets/images/6853dd80301a7b20b31a2cfa35c0e9d3.jpg');
    }

    async componentDidMount() {        
        // let img = require('../../assets/images/124235523451.webp');
        this.setState({ imageUrl: this.image1 });
    }

    private async changeImage(imageUrl: string) {
        let img = this.switch ? this.image1 : this.image2;
        this.switch = !this.switch;
        this.setState({ imageUrl: img });
    }

    public render(): React.ReactElement<MainComponent> {
        return (
            <div className='card-body px-4'>
                <div>
                    <input type='checkbox' onClick={() => this.changeImage('')}></input>
                </div>
                <PackageComponent 
                    imageUrl={this.state.imageUrl}></PackageComponent>
            </div>
        );
    }
}
