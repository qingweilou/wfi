import React from 'react';
import {Line} from 'react-chartjs-2';

export default class DataChart extends React.Component{
    render() {
        let data = {};
        if (this.props.columns && this.props.data && this.props.data.length >=0) {
            const segments = this.props.data.map((x, idx) =>{
                return {
                    label : this.props.rows[idx],
                    fill : false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,193,192,1)',
                    data: x
                };
            });
            data = {
            labels: this.props.columns,
            datasets: segments
          };
        }

        return (
            <div>
                <h2>{this.props.name}</h2>
                <Line data = {data}></Line>
            </div>
        );
    }

    getData() {
        const data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
              {
                  label: 'My First Dataset',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,193,192,1)',
                  data: [65,59,80,81,56,55,40]
              }
          ]
        };
        return data;
      }
};