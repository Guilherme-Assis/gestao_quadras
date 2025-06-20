import { supabase } from './supabaseClient.js';

// 1. Faturamento diário
export async function faturamentoDiario() {
    const { data, error } = await supabase.rpc('faturamento_diario');
    if (error) throw error;
    return data;
}

// 2. Faturamento mensal
export async function faturamentoMensal() {
    const { data, error } = await supabase.rpc('faturamento_mensal');
    if (error) throw error;
    return data;
}

// 3. Faturamento por quadra
export async function faturamentoPorQuadra() {
    const { data, error } = await supabase
        .from('comandas')
        .select('quadras!inner(nome), total')
        .eq('status', 'fechada');

    if (error) throw error;

    const agrupado = data.reduce((acc, item) => {
        const nome = item.quadras.nome;
        acc[nome] = (acc[nome] || 0) + item.total;
        return acc;
    }, {});

    return Object.entries(agrupado).map(([nome, total]) => ({ nome, total }));
}

// 4. Produtos mais vendidos
export async function produtosMaisVendidos() {
    // 1. Buscar todos os itens
    const { data: itens, error: errorItens } = await supabase
        .from('itens_comanda')
        .select('produto_id, quantidade');

    if (errorItens) throw errorItens;

    // 2. Buscar todos os produtos
    const { data: produtos, error: errorProdutos } = await supabase
        .from('produtos')
        .select('id, nome');

    if (errorProdutos) throw errorProdutos;

    // 3. Agrupar os produtos com base nos nomes
    const agrupado = {};

    itens.forEach(item => {
        const produto = produtos.find(p => p.id === item.produto_id);
        const nome = produto?.nome || 'Desconhecido';
        agrupado[nome] = (agrupado[nome] || 0) + item.quantidade;
    });

    return Object.entries(agrupado).map(([nome, quantidade]) => ({
        nome,
        quantidade
    }));
}

// 5. Ticket médio (total / qtd comandas)
export async function ticketMedio() {
    const { data: comandas, error } = await supabase
        .from('comandas')
        .select('total')
        .eq('status', 'fechada');

    if (error) throw error;

    const total = comandas.reduce((acc, c) => acc + c.total, 0);
    const media = comandas.length > 0 ? (total / comandas.length) : 0;

    return { ticketMedio: media };
}

// 6. Uso por hora
export async function usoPorHora() {
    const { data, error } = await supabase
        .from('comandas')
        .select('data_abertura');

    if (error) throw error;

    const porHora = data.reduce((acc, { data_abertura }) => {
        const hora = new Date(data_abertura).getHours();
        acc[hora] = (acc[hora] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(porHora).map(([hora, qtd]) => ({ hora, quantidade: qtd }));
}

// 7. Clientes que mais compram
export async function clientesQueMaisCompram() {
    const { data, error } = await supabase
        .from('comandas')
        .select('cliente_nome, total');

    if (error) throw error;

    const agrupado = data.reduce((acc, c) => {
        acc[c.cliente_nome] = (acc[c.cliente_nome] || 0) + c.total;
        return acc;
    }, {});

    return Object.entries(agrupado).map(([cliente, total]) => ({ cliente, total }));
}

// 8. Indicadores de performance
export async function indicadoresPerformance() {
    const { data: comandas, error } = await supabase
        .from('comandas')
        .select('total, data_abertura')
        .eq('status', 'fechada');

    if (error) throw error;

    const hoje = new Date().toISOString().split('T')[0];
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