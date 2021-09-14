const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) =>{
    MongoClient.connect(
        'mongodb+srv://Emmanuel:B55nWv_-JL2N-Xw@cluster0.wo1wx.mongodb.net/shop?retryWrites=true&w=majority'
       )
        .then(client => {
            _db = client.db();
            callback();
        }).catch(err => {
            console.log(err)
        })
}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No database found'
}


exports.mongoConnect = mongoConnect;
exports.getDb = getDb;