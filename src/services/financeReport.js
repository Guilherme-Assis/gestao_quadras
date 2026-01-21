import { supabase } from './supabaseClient.js';

// Utilitário para datas padrão (últimos 30 dias)
function getRange(dataInicio, dataFim) {
    const fim = dataFim || new Date().toISOString().split('T')[0];
    const inicio = dataInicio || new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return { inicio, fim };
}

// 1. Faturamento diário (últimos 7 dias fixos via RPC sem parâmetros)
export async function faturamentoDiario() {
    const { data, error } = await supabase.rpc('faturamento_diario');
    if (error) throw error;
    return data;
}

// 2. Faturamento mensal
export async function faturamentoMensal(dataInicio, dataFim) {
    const { inicio, fim } = getRange(dataInicio, dataFim);
    const { data, error } = await supabase.rpc('faturamento_mensal', { data_inicio: inicio, data_fim: fim });
    if (error) throw error;
    return data;
}

// 3. Faturamento por quadra
export async function faturamentoPorQuadra(dataInicio, dataFim) {
    const { inicio, fim } = getRange(dataInicio, dataFim);

    const { data, error } = await supabase
        .from('comandas')
        .select('quadras!inner(nome), total, data_abertura')
        .eq('status', 'fechada')
        .gte('data_abertura', inicio)
        .lte('data_abertura', fim);

    if (error) throw error;

    const agrupado = data.reduce((acc, item) => {
        const nome = item.quadras.nome;
        acc[nome] = (acc[nome] || 0) + item.total;
        return acc;
    }, {});

    return Object.entries(agrupado).map(([nome, total]) => ({ nome, total }));
}

// 4. Produtos mais vendidos
export async function produtosMaisVendidos(dataInicio, dataFim) {
    const { inicio, fim } = getRange(dataInicio, dataFim);

    const { data: itens, error: errorItens } = await supabase
        .from('itens_comanda')
        .select('produto_id, quantidade, comandas(data_abertura)')
        .gte('comandas.data_abertura', inicio)
        .lte('comandas.data_abertura', fim);

    if (errorItens) throw errorItens;

    const { data: produtos, error: errorProdutos } = await supabase
        .from('produtos')
        .select('id, nome');

    if (errorProdutos) throw errorProdutos;

    const agrupado = {};

    itens.forEach(item => {
        const produto = produtos.find(p => p.id === item.produto_id);
        const nome = produto?.nome || 'Desconhecido';
        agrupado[nome] = (agrupado[nome] || 0) + item.quantidade;
    });

    return Object.entries(agrupado).map(([nome, quantidade]) => ({ nome, quantidade }));
}

// 5. Ticket médio
export async function ticketMedio(dataInicio, dataFim) {
    const { inicio, fim } = getRange(dataInicio, dataFim);

    const { data: comandas, error } = await supabase
        .from('comandas')
        .select('total, data_abertura')
        .eq('status', 'fechada')
        .gte('data_abertura', inicio)
        .lte('data_abertura', fim);

    if (error) throw error;

    const total = comandas.reduce((acc, c) => acc + c.total, 0);
    const media = comandas.length > 0 ? (total / comandas.length) : 0;

    return { ticketMedio: media };
}

// 6. Uso por hora
export async function usoPorHora(dataInicio, dataFim) {
    const { inicio, fim } = getRange(dataInicio, dataFim);

    const { data, error } = await supabase
        .from('comandas')
        .select('data_abertura')
        .gte('data_abertura', inicio)
        .lte('data_abertura', fim);

    if (error) throw error;

    const porHora = data.reduce((acc, { data_abertura }) => {
        const hora = new Date(data_abertura).getHours();
        acc[hora] = (acc[hora] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(porHora).map(([hora, qtd]) => ({ hora, quantidade: qtd }));
}

// 7. Clientes que mais compram
export async function clientesQueMaisCompram(dataInicio, dataFim) {
    const { inicio, fim } = getRange(dataInicio, dataFim);

    const { data, error } = await supabase
        .from('comandas')
        .select('cliente_nome, total, data_abertura')
        .eq('status', 'fechada')
        .gte('data_abertura', inicio)
        .lte('data_abertura', fim);

    if (error) throw error;

    const agrupado = data.reduce((acc, c) => {
        acc[c.cliente_nome] = (acc[c.cliente_nome] || 0) + c.total;
        return acc;
    }, {});

    return Object.entries(agrupado).map(([cliente, total]) => ({ cliente, total }));
}

// 8. Indicadores de performance
export async function indicadoresPerformance(dataInicio, dataFim) {
    const { inicio, fim } = getRange(dataInicio, dataFim);
    const hoje = new Date().toISOString().split('T')[0];

    const { data: comandas, error } = await supabase
        .from('comandas')
        .select('total, data_abertura')
        .eq('status', 'fechada')
        .gte('data_abertura', inicio)
        .lte('data_abertura', fim);

    if (error) throw error;

    const hojeTotal = comandas
        .filter(c => c.data_abertura.startsWith(hoje))
        .reduce((acc, c) => acc + c.total, 0);

    const geralTotal = comandas.reduce((acc, c) => acc + c.total, 0);

    return {
        hoje: hojeTotal,
        totalGeral: geralTotal,
        totalComandas: comandas.length
    };
}