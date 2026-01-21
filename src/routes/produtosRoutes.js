import express from 'express'
import {
    listarProdutos,
    obterProduto,
    criarProduto,
    atualizarProduto,
    deletarProduto,
    listarProdutosComEstoque
} from '../controllers/produtosController.js'

const router = express.Router()

router.get('/produtos', listarProdutos)
router.get('/produtos/disponiveis', listarProdutosComEstoque)
router.get('/produtos/:id', obterProduto)
router.post('/produtos', criarProduto)
router.put('/produtos/:id', atualizarProduto)
router.delete('/produtos/:id', deletarProduto)

export default router
