import express from 'express';
import dotenv from 'dotenv';
import router from './router'

dotenv.config({path: './src/config/.env'})

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT
app.use('/api', router());


app.listen(PORT, () => {
    console.log(`Server runnig on ${PORT} PORT`)
})