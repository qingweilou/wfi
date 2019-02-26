import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown,MenuItem } from 'react-bootstrap';
import axios from 'axios';

export default class POVBar extends React.Component {
    constructor() {
        super();
        this.state = {};
    }  
    componentDidMount() {
        this.getDimensionData();
        this.getReportList();
    }

    getDimensionData() {
        axios.get("/api/dimensions")
        .then(response => {
            this.setState({
                dimensions: response.data.dimensions     
            });
            let pov = {};
            response.data.dimensions.forEach(dim =>{
                if (!dim.default) {
                    dim.default = dim.members.find(x=>x.level === 1);
                }
                pov[dim.name] = dim.default.id;
            });
            this.props.povChanged(pov);
        })
    }

    getReportList() {
        axios.get("/api/reports")
        .then(response => {
            console.log(response);
            this.setState({
                reports: response.data     
            })
        });
    }

    render() {
        const dims = [];
        this.state && this.state.dimensions && this.state.dimensions.forEach(x => { 
            dims.push(<POV key = {x.name} povKey={x.name} items = {x.members} 
                    povChanged={this.props.povChanged}/>);
        });

        return (
        <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                Point Of View
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>              
                {dims}
            </Nav>
            <Nav pullRight>
                <ReportList items = {this.state.reports} reportSelected = {this.props.reportSelected} />
            </Nav>
        </Navbar>
        );
    };
}

class POV extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
        this.selected = this.selected.bind(this);
    }

    selected(evt) {
        let node = this.props.items.find(x => x.id === evt);
        this.setState({selected: node.desc});
        let changedPov = {};
        changedPov[this.props.povKey] = evt;
        this.props.povChanged(changedPov);
    }

    render() {
        const items = [];
        let topNode;
        this.props.items.forEach(x => {
            items.push(<MenuItem key = {x.id} eventKey={x.id}> {x.desc} </MenuItem>) ;
            if (x.level === 1) {
                topNode = {id: x.id, desc: x.desc};
            }
        });
        
        return (
            <NavDropdown eventKey={this.povKey} 
                title={this.state.selected ? this.state.selected:topNode.desc} 
                id={this.props.povKey}
                onSelect={this.selected}>
                {items}
                <MenuItem divider />
                <MenuItem eventKey={3.4}>...more...</MenuItem>
            </NavDropdown>
        );
    };
}

class ReportList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
        this.selected = this.selected.bind(this);
    }

    selected(evt) {
        const selected = this.props.items.find(x=>evt === x.id);
        this.setState({
            selected
        });
        this.props.reportSelected(selected);
    }

    render() {
        const items = []
        const list = this.props.items; 
        if (list) {
            list.forEach(x => {
                items.push(<MenuItem key = {x.id} eventKey={x.id}> {x.name} </MenuItem>) ;
            });
        }
        
        return (
            <NavDropdown eventKey= "reportList"
                title = {this.state.selected ? this.state.selected.name : 'Select a report ...'}
                id="reportList"
                onSelect={this.selected}>
                {items}
            </NavDropdown>
        );
    };
}
