import React from 'react';
import {Navbar, Nav, NavItem, NavDropdown,MenuItem } from 'react-bootstrap';
import axios from 'axios';

export default class POVBar extends React.Component {  
    componentDidMount() {
        this.getDimensionData();
    }

    getDimensionData() {
        axios.get("/api/dimensions")
        .then(response => {
            this.setState({
                dimensions: response.data.dimensions     
            });
            response.data.dimensions.forEach(dim =>{
                this.props.povChanged(dim.name, dim.default);
            });
        })
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
        this.setState({selected: node.desc})
        this.props.povChanged(this.props.povKey, evt);
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
