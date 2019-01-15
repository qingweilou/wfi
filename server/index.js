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
    const report = {
        name: 'basic report',
        columns : {name:'Account', members: ['KPI1', 'KPI2']},
        rows : {name: 'OrgUnit', members: ['80356000','80357000','80358000','80359000']},
        page: [{name:'Time', value: 'pov'}, {name: 'Version', value: 'pov'}]
    }
    res.send(report)
});

app.get('/data', (req, res) => {
    MDA.getData(req.query, (err, ret)=>{res.send(ret);});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))