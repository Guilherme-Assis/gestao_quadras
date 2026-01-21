import express from 'express'
import {
    listarQuadras,
    obterQuadra,
    criarQuadra,
    atualizarQuadra,
    deletarQuadra
} from '../controllers/quadrasController.js'

const router = express.Router()

router.get('/', listarQuadras)
router.get('/:id', obterQuadra)
router.post('/', criarQuadra)
router.put('/:id', atualizarQuadra)
router.delete('/:id', deletarQuadra)

export default router
