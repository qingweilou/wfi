const timeDimMembers = require('./timeDimMembers');
const orgUnitDimMembers = require('./orgUnitDimMembers');
const accountDimMembers = require('./accountDimMembers');
const versionDimMembers = require('./versionDimMembers');
const wfiFact = require('./wfiFact');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

function insert(tblname, tblvals) {
    let client;
    MongoClient.connect(url)
    .then( x => {
        client = x;
        const db = client.db('WFI');
        return db; 
    })
    .then(db =>{
        db.dropCollection(tblname);
        return db;
    })
    .then(db => {
        return db.createCollection(tblname);
    })
    .then(coll=>{
        return coll.insertMany(tblvals);
    })
    .then(res =>{
        console.log(res);
    })
    .catch(err =>{
        console.log("connnection error", err);
    })
    .finally(() =>{
        client.close();
    })
}

insert('TimeDim', timeDimMembers);
insert('OrgUnitDim', orgUnitDimMembers);
insert('AccountDim', accountDimMembers);
insert('VersionDim', versionDimMembers);

insert('WfiFact', wfiFact);