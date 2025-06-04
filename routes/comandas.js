import express from 'express'
import {
    listarComandas,
    obterComanda,
    criarComanda,
    fecharComanda,
    deletarComanda
} from '../controllers/comandasController.js'

const router = express.Router()

router.get('/', listarComandas)
router.get('/:id', obterComanda)
router.post('/', criarComanda)
router.put('/:id/fechar', fecharComanda)
router.delete('/:id', deletarComanda)

export default router
