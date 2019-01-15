const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

class MultiDimensionAccess {
    constructor(connURL, dbName) {
        this.url = connURL;
        this.dbName = dbName;
        this.client = MongoClient.connect(this.url)
    };
    
    getDimensions(cb) {
        this.client.then(client => {
            const db = client.db(this.dbName);
            db.listCollections().toArray().then(items => {
                const dimensionNames = items.filter(item => {
                    return item.name.match(/Dim$/g);
                }).map(item=>{ return item.name});
               
                const dimensions = dimensionNames.map(dColl => {
                    const coll = db.collection(dColl);
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

                    this.hierachies = {};
                    dimensionNames.map((name, index) =>{                      
                        this.hierachies[name] =  this.getDimensionHierachy(values[index]);
                    });
                    return cb (null, {dimensions: dims});
                })
            })
        }).catch(err =>{
        return cb (err);
        });
    };

    getData(query ,cb ) {
        const cubeName = query.cubeName+"Fact";
        const colDimName = query.columnDim;
        const rowDimName = query.rowDim;
        this.client.then( client => {
            const db = client.db(this.dbName);
            const coll = db.collection(cubeName);
            const findCriteria = {};
            Object.keys(query).forEach(item => {
                if (item !=='cubeName' && item !=='columnDim' && item !== 'rowDim') {
                    const dimMbr = query[item];
                    const members = this.getLeaves(item+"Dim", dimMbr);
                    findCriteria[item+"DimId"] = {$in: members};
                }
            }) 
            return coll.find(findCriteria).project({'_id':0}).toArray();
        })
        .then(data => {
            const cols = {name: colDimName + "Dim", members: query.Account.split(',')};
            const rows = {name: rowDimName + "Dim", members: query.OrgUnit.split(',')};
            const ret = new Array(rows.members.length).fill(0).map(
                ()=>new Array(cols.members.length).fill(0));
        
            const colHash = {};
            const rowHash = {};

            cols.members.forEach((x, idx) => {
                colHash[x] = idx;
            });
            rows.members.forEach((x, idx) => {
                rowHash[x] = idx;
            });
            const rowDim = rows.name + "Id";
            const colDim = cols.name + "Id";
            for (let i=0; i<data.length; i++) {
                const rowVal = rowHash[data[i][rowDim]];
                const colVal = colHash[data[i][colDim]];
                ret[rowVal][colVal] += data[i].Measure;
            };
            return cb(null, {
                columns : cols.membrs,
                rows : rows.members,
                data : ret
            });
        })
        .catch(err => {
            return cb(err)
        });
    };

    getDimensionHierachy(members) {
        const hash = {};
        members.forEach( x => {
            x.children = [];
            hash[x.id] = x;
        });

        Object.keys(hash).forEach( key => {
            const node = hash[key];
            if (node.parent) {
                hash[node.parent].children.push(node);
            }
        });
        return hash;
    }

    getLeaves(dimName, mbrIds) {
        const hiearchy = this.hierachies[dimName];
        const queue = mbrIds.split(",").map(x=>hiearchy[x]);
        const ret = [];
        
        while (queue.length > 0) {
            const n = queue.shift();
            if (n.children.length === 0) {
                ret.push(n);
            } else {
                n.children.forEach(x => {queue.push(x)});
            }
        } 
        return ret.map(x=>x.id);
    }
}

module.exports = MultiDimensionAccess;