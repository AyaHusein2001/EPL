// establishing a connection with db

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let database ;

async function connect() {
    
    const client = await MongoClient.connect('mongodb://localhost:27017');
   // getting database we want
    database = client.db('EPL_ticket_reserve');
}

function getDb() {
    if (!database) {
        throw {message: 'Database connection not established! '};

    }
    return database;
}

module.exports={
    connectToDatabase : connect,
    getDb: getDb
};