const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const Config = require('./config').default;
const jose = require('jose');
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = Config.API_URL;
const app = express();

const secret = new TextEncoder().encode('f30e7c6f861eb133858962c280d4388cf711a9a69697a72299ed9142d6c71dce');

const corsOptions = {
    origin: Config.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200
};

const createLimiter = (period, amount) => rateLimiter({
    windowMs: period,
    max: amount,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('public', { maxAge: 31557600 }));

let mongoClient, usersCollection, counterCollection;

const initUsersDB = async () => {
  const DB = Config.DatabaseInfo;
  const uri = `mongodb+srv://${DB.USERNAME}:${DB.PASSWORD}@${DB.URI}`;

  mongoClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
  });
  await mongoClient.connect();

  usersCollection = mongoClient.db('whis').collection('users');
  counterCollection = mongoClient.db('whis').collection('counters');

  const cleanup = () => {
    mongoClient.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};

initUsersDB();


async function createToken(id) {
  const alg = 'HS256';
  
  const jwt = await new jose.SignJWT({ id })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('720h')
    .sign(secret);

  return jwt;
}


app.use('/api/users/createAccount', createLimiter(5  * 1000, 1));
app.post('/api/users/createAccount', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: 'Body not found'
    });
  }

  const { username, password } = req.body;

  const check = await usersCollection.findOne({ username });

  if (check) {
    return res.status(409).json({ success: false });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const counter = await counterCollection.findOneAndUpdate(
    { _id: 'users' }, 
    { $inc: { seq_value: 1 }}, 
    { returnDocument: 'after' }
  );

  const id = counter.value.seq_value;
  
  const jwt = await createToken(id);

  const result = await usersCollection.insertOne({
    _id: id,
    username,
    password: password_hash,
    saved_list: []
  });

  return res.status(200).json({
    success: true,
    user: await usersCollection.findOne({ _id: result.insertedId }),
    token: jwt
  });
});


app.use('/api/users/login', createLimiter(5 * 1000, 1));
app.post('/api/users/login', async (req, res) => {
  let hasToken = false;

  const auth = req.headers.authorization;
  if (auth && auth.indexOf('Bearer ') !== -1) {
    hasToken = true;
  }

  if (!hasToken && !req.body) {
    return res.status(400).json({
      success: false,
      message: 'Body not found'
    });
  }

  if (hasToken) {
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
      const { payload } = await jose.jwtVerify(token, secret);

      if (payload.exp >= Date.now()) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized HTTP'
        });
      }
  
      return res.status(200).json({
        success: true,
        user: await usersCollection.findOne({ _id: payload.id })
      });
    } catch {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized HTTP'
      });
    }
  }

  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username });

  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized HTTP'
    });
  };

  const jwt = await createToken(user._id);

  return res.status(200).json({
    success: true,
    user,
    token: jwt
  });
});


app.listen(port);
console.log('Started');
