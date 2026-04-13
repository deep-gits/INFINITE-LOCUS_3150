const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  // This will download the MongoDB binary on first run and start it.
  console.log("Downloading/Starting Local MongoDB Node...");
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'eventmgmt'
    }
  });

  const uri = mongod.getUri();
  console.log("Memory MongoDB successfully started and running on:", uri);
  console.log("Leave this window open! The Java backend can now connect.");
})();
