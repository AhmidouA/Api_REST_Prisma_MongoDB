import express from 'express';
import dotenv from 'dotenv';

dotenv.config({path: './src/config/.env'})

const app = express()
const PORT = process.env.PORT


app.listen(PORT, () => {
    console.log(`Server runnig on ${PORT} PORT`)
})