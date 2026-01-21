
import express from 'express'
import {
    adicionarItem,
    atualizarItem,
    deletarItem,
    listarItensDaComanda,
    marcarItemComoPago
} from '../controllers/itensController.js'

const router = express.Router()

router.post('/itens', adicionarItem)
router.put('/itens/:id', atualizarItem)
router.delete('/itens/:id', deletarItem)
router.get('/itens/comanda/:comanda_id', listarItensDaComanda)
router.put('/itens/:id/pagar', marcarItemComoPago);

export default router
