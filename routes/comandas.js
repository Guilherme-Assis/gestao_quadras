import express from 'express'
import {
    listarComandas,
    obterComanda,
    criarComanda,
    fecharComanda,
    atualizarHorasComanda,
    pagarHorarioComanda,
    limparQuadraComanda,
    deletarComanda
} from '../controllers/comandasController.js'

const router = express.Router()

router.get('/', listarComandas)
router.get('/:id', obterComanda)
router.post('/', criarComanda)
router.put('/:id/fechar', fecharComanda)
router.put('/:id/horas', atualizarHorasComanda);
router.put('/:id/pagar', pagarHorarioComanda);
router.put('/:id/limpar-quadra', limparQuadraComanda);
router.delete('/:id', deletarComanda)

export default router
