import express from "express";
import routes from "./routes/index.js"
import cors from 'cors'



const app = express();

app.use(cors({
    origin: '*', // Ou a URL do seu front, ex: 'http://localhost:5173'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
routes(app);

export default app;