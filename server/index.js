const express = require('express');
const MultiDimensionAccess = require('./MultiDimensionAccess');
const url = 'mongodb://localhost:27017';
const app = express();
const port = 3000;

const MDA = new MultiDimensionAccess(url, 'WFI');

app.get('/dimensions', (req, res) => {
    MDA.getDimensions((err, ret)=>{res.send(ret);});
});

app.get('/reports/:id', (req, res) => {
    const reports ={
        1: {
            name: 'comparison report',
            columns :  {name: 'OrgUnit', members: ['80356000','80357000','80358000','80359000','80400000']},
            rows : {name:'Account', members: ['KPI1', 'KPI2']},
            page: [{name:'Time', value: 'pov'}, {name: 'Version', value: 'pov'}]
        },
        2 : {
            name: 'trend report',
            columns :  {name: 'Time', members: ['2018-JAN','2018-FEB','2018-MAR','2018-APR','2018-MAY','2018-JUN']},
            rows : {name:'Account', members: ['KPI1', 'KPI2']},
            page: [{name:'OrgUnit', value: 'pov'}, {name: 'Version', value: 'pov'}]
        }
    };
    console.log(req.params.id);
    console.log(reports[req.params.id||1])
    res.send(reports[req.params.id||1]);
});

app.get('/reports', (req, res) => {
    const reports = [
        {id: 1, name:"Time trend report"},
        {id: 2, name:"Comparison report"}];
    res.send(reports)
});

app.get('/data', (req, res) => {
    MDA.getData(req.query, (err, ret)=>{res.send(ret);});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))