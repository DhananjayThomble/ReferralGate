const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');


const connectDB = require('./config/dbConfig');
const DB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URI : process.env.DB_URI;
connectDB(DB_URI);

const port = process.env.PORT || 3000;

app.use(express.json()); // to parse JSON
app.use(morgan('dev')); // to log requests
app.use(helmet()); // to set secure HTTP headers / it will hide the information about the server and the framework
app.use(cors()); // to allow cross-origin requests
app.use(compression()); // to compress the response body

const userRouter = require('./routes/userRoutes');

app.use('/worko', userRouter);

const errorHandler = require('./middlewares/errorHandler');


app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;