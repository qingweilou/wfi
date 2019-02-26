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
        this.reportSelected = this.reportSelected.bind(this);
    }

    povChanged(changedPov) {
        let pov = Object.assign(this.state.pov, changedPov);
        this.setState({
            pov: pov
        })
    }
    reportSelected(selectedReport) {
        this.setState(
            {selectedReport}
        )
    };

    render() {       
       return (
           <div>
               <POVBar povChanged = {this.povChanged} reportSelected = {this.reportSelected}/>
               <Report pov = {this.state.pov} report = {this.state.selectedReport}/>
            </div>
        );
    }

}
