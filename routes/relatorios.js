import express from 'express';
import {
    relatorioFaturamentoDiario,
    relatorioFaturamentoMensal,
    relatorioFaturamentoPorQuadra,
    relatorioProdutosMaisVendidos,
    relatorioTicketMedio,
    relatorioUsoPorHora,
    relatorioClientesTop,
    relatorioIndicadoresFinanceiros
} from '../controllers/relatoriosController.js';

const router = express.Router();

router.get('/faturamento-diario', relatorioFaturamentoDiario);
router.get('/faturamento-mensal', relatorioFaturamentoMensal);
router.get('/faturamento-por-quadra', relatorioFaturamentoPorQuadra);
router.get('/produtos-mais-vendidos', relatorioProdutosMaisVendidos);
router.get('/ticket-medio', relatorioTicketMedio);
router.get('/uso-por-hora', relatorioUsoPorHora);
router.get('/clientes-top', relatorioClientesTop);
router.get('/indicadores', relatorioIndicadoresFinanceiros);

export default router;