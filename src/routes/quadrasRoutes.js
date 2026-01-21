import express from 'express'
import {
    listarQuadras,
    obterQuadra,
    criarQuadra,
    atualizarQuadra,
    deletarQuadra
} from '../controllers/quadrasController.js'

const router = express.Router()

router.get('/quadras', listarQuadras)
router.get('/quadras/:id', obterQuadra)
router.post('/quadras', criarQuadra)
router.put('/quadras/:id', atualizarQuadra)
router.delete('/quadras/:id', deletarQuadra)

export default router
