import React from 'react';
import {Line} from 'react-chartjs-2';

export default class DataChart extends React.Component{
    render() {
        return (
            <div>
                <h2>Line example</h2>
                <Line data = {this.getData()}></Line>
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