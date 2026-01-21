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

router.get('/comandas', listarComandas)
router.get('/comandas/:id', obterComanda)
router.post('/comandas', criarComanda)
router.put('/comandas/:id/fechar', fecharComanda)
router.put('/comandas/:id/horas', atualizarHorasComanda);
router.put('/comandas/:id/pagar', pagarHorarioComanda);
router.put('/comandas/:id/limpar-quadra', limparQuadraComanda);
router.delete('/comandas/:id', deletarComanda)

export default router
