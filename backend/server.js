import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config.js';
import router from './router/route.js';



import connect from './database/conn.js';

const app = express()
//config();


app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;



app.use('/api', router) 


app.get('/', (req, res) => {
    try {
        res.json("Get Request")
    } catch (error) {
        res.json(error)
    }
})


connect().then(() => {
    try {
        app.listen(config.port, () => {
            console.log(`Server connected to http://localhost:${config.port}`)
        })
    } catch (error) {
        console.log("Cannot connect to the server");
    }
}).catch(error => {
    console.log("Invalid Database Connection");
})

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  });