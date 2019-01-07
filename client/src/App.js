import React, { Component } from 'react';
import Report from './Report';
import POVBar from './POVBar';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pov: {}
        }
        this.povChanged = this.povChanged.bind(this);
    }
    povChanged(dim, value) {
        let pov = this.state.pov;
        pov[dim] = value;
        this.setState({
            pov: pov
        })
    }
    render() {       
       return (
           <div>
               <POVBar povChanged = {this.povChanged}/>
               <Report pov = {this.state.pov}/>
            </div>
        );
    }

}
