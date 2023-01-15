'use strict';

const 

express = require('express'),
bodyParser = require('body-parser'),
{ MongoMemoryServer } = require('mongodb-memory-server'),
{ default: mongoose } = require('mongoose');

const app = express();
const port =  process.env.PORT || 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.json());
// routes
app.use('/', 
require('./routes/profile')(),
require('./routes/user-account')(),
require('./routes/comment')(),
require('./routes/like')(),
);

const mongoMemoryServer = new MongoMemoryServer();
mongoose.set('strictQuery', false);

// start server
app.listen(port, async () => {

    const mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log('Express started. Listening on %s', port);

});
