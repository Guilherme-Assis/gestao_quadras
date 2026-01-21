import dotenv from 'dotenv'
import app from "./src/app.js"
import cors from 'cors'


dotenv.config()
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
