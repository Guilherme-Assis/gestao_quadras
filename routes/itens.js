import express from 'express'
import {
    adicionarItem,
    atualizarItem,
    deletarItem,
    listarItensDaComanda
} from '../controllers/itensController.js'

const router = express.Router()

router.post('/', adicionarItem)
router.put('/:id', atualizarItem)
router.delete('/:id', deletarItem)
router.get('/comanda/:comanda_id', listarItensDaComanda)

export default router
