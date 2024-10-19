require('dotenv').config({ path: './config.env' });
require('express-async-errors');
const express = require('express');
const app = express();
const { connectToDatabase } = require('./db/connect');
const { authenticationMiddleware } = require('./middleware/authentication');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

// routers
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.get('/', (req, res) => {
  res.send('jobs api');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticationMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;
const DATABASE = process.env.DATABASE.replace(
  '<db_password>',
  process.env.MONGODB_PASSWORD
);

const startServer = async () => {
  try {
    // Connect to the database
    await connectToDatabase(DATABASE);
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Terminate the process if the database fails to connect
  }
};

startServer();
