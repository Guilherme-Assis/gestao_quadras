import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import quadrasRoutes from './routes/quadras.js'
import produtosRoutes from './routes/produtos.js'
import comandasRoutes from './routes/comandas.js'
import itensRoutes from './routes/itens.js'


dotenv.config()
const app = express()
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())

app.use('/quadras', quadrasRoutes)
app.use('/produtos', produtosRoutes)
app.use('/comandas', comandasRoutes)
app.use('/itens', itensRoutes)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`))
