const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3000;
const url = 'mongodb://localhost:27017';

app.get('/dimensions', (req, res) => {
    MongoClient.connect(url)
    .then( client => {
            const db = client.db('WFI');
            db.listCollections().toArray().then(items => {
                const dimensionNames = items.filter(item => {
                    return item.name.match(/Dim$/g);
                }).map(item=>{ return item.name});

                const dimensions = dimensionNames.map(dColl => {
                    coll = db.collection(dColl);
                    items = coll.find({}).project({'_id':0}).toArray();
                    return items;
                });
                Promise.all(dimensions).then(values =>{
                    const dims = dimensionNames.map((name, index) =>{
                        return {
                            name : name.slice(0, -3),
                            members: values[index]
                        }
                    });
                    res.send({dimensions: dims});
                })
                client.close();
            })
    })
    .catch(err =>{
        console.log("connnection error", err);
        client.close();
    });
});

app.get('/reports/:id', (req, res) => {
    const report = {
        name: 'basic report',
        columns : {name:'Account', members: ['income', 'cost', 'output', 'revenue', 'salary']},
        rows : {name: 'Entity', members: ['us', 'colorado', 'new york', 'arizona']},
        page: [{name:'Time', value: 'pov'}, {name: 'Version', value: 'pov'}]
    }
    res.send(report)
});

app.get('/data', (req, res) => {
    console.log(req.query);
    const data = {
        columns : ['income', 'cost', 'output', 'revenue', 'salary'],
        rows : ['us', 'colorado', 'new york', 'arizona'],
        data : [[1000,2600,1600,1460,820],
            [100,200,100,140,80], 
            [100,200,100,140,80],
            [100,200,100,140,80] ]
    }
    res.send(data)
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))