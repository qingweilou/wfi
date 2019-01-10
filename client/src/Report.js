import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import DataGrid from './DataGrid';
import DataChart from './DataChart';
import axios from 'axios';
          
export default class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.getData = this.getData.bind(this);
        this.getReport = this.getReport.bind(this);
    }
    componentDidMount() {
        this.getReport();
        this.getData();
    }
    componentWillReceiveProps(nextProps) {
        this.getData();
    } 

    getData() {
        const keys = {};
        this.state && this.state.page && this.state.page.forEach(x => {
            if (x.value === 'pov') {
                keys[x.name] = this.props.pov[x.name];
            } else {
                keys[x.name] = x.value;
            }
        });
        if (this.state.rows) {
            keys[this.state.rows.name] = this.state.rows.members.join(',');
        }
        if (this.state.columns) {
            keys[this.state.columns.name] = this.state.columns.members.join(',');
        }
        var queryStr = Object.keys(keys).map(key => key + '=' + keys[key]).join('&'); 

        axios.get("/api/data?"+queryStr)
        .then(response => {
            this.setState({
                data: response.data.data,        
            });
        })
    }

    getReport() {
        axios.get('/api/reports/1')
        .then(response => {
            this.setState(
                {
                    name: response.data.name,
                    page: response.data.page,
                    columns: response.data.columns,
                    rows: response.data.rows
                }
            )
        })
    }

    render() {
        let grid;
        if (this.state && this.state.columns && this.state.rows) {
            grid = <DataGrid
                            columns = {this.state.columns.members} 
                            rows={this.state.rows.members} 
                            data={this.state.data}/> ;
        }
        return (       
            <Tabs defaultActiveKey={1} id="DataPanel" style = {{paddingLeft: 45}}>
                <Tab eventKey={1} title="Data">
                    {grid}
                </Tab>
                <Tab eventKey={2} title="Graph">
                    <DataChart/>
                </Tab>
            </Tabs>
         );
     }
}