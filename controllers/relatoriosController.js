import {
    faturamentoDiario,
    faturamentoMensal,
    faturamentoPorQuadra,
    produtosMaisVendidos,
    ticketMedio,
    usoPorHora,
    clientesQueMaisCompram,
    indicadoresPerformance
} from '../services/financeReports.js';

export const relatorioFaturamentoDiario = async (req, res) => {
    try {
        const data = await faturamentoDiario();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const relatorioFaturamentoMensal = async (req, res) => {
    try {
        const data = await faturamentoMensal();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const relatorioFaturamentoPorQuadra = async (req, res) => {
    try {
        const data = await faturamentoPorQuadra();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const relatorioProdutosMaisVendidos = async (req, res) => {
    try {
        const data = await produtosMaisVendidos();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const relatorioTicketMedio = async (req, res) => {
    try {
        const data = await ticketMedio();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const relatorioUsoPorHora = async (req, res) => {
    try {
        const data = await usoPorHora();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const relatorioClientesTop = async (req, res) => {
    try {
        const data = await clientesQueMaisCompram();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const relatorioIndicadoresFinanceiros = async (req, res) => {
    try {
        const data = await indicadoresPerformance();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};