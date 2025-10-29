import { supabase } from '../services/supabaseClient.js'

// GET /comandas
export const listarComandas = async (req, res) => {
    const { data, error } = await supabase.from('comandas').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

// GET /comandas/:id
export const obterComanda = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('comandas').select('*').eq('id', id).single()
    if (error) return res.status(404).json({ error: 'Comanda não encontrada' })
    res.json(data)
}

// POST /comandas
export const criarComanda = async (req, res) => {
    const { nome, quadra_id, cliente_nome, valor_horario, horas_reservadas } = req.body;

    const { data, error } = await supabase
        .from('comandas')
        .insert([{
            nome,
            quadra_id,
            cliente_nome,
            status: 'aberta',
            valor_horario: parseFloat(valor_horario) || 0,
            horas_reservadas
        }])
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
}

// PUT /comandas/:id/fechar
export const fecharComanda = async (req, res) => {
    const { id } = req.params
    const data_fechamento = new Date().toISOString()

    const { data, error } = await supabase
        .from('comandas')
        .update({ status: 'fechada', data_fechamento })
        .eq('id', id)
        .eq('status', 'aberta')
        .select()
        .single()

    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
}

// PUT /comandas/:id/horas
export const atualizarHorasComanda = async (req, res) => {
    const { id } = req.params;
    const { horas } = req.body; 

    if (horas === undefined) {
        return res.status(400).json({ error: 'O campo "horas" é obrigatório no corpo da requisição.' });
    }

    const horasParseadas = parseInt(horas);

    if (isNaN(horasParseadas)) {
        return res.status(400).json({ error: 'O campo "horas" deve ser um número inteiro.' });
    }

    const { data, error } = await supabase
        .from('comandas')
        .update({ horas_reservadas: horasParseadas })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    if (!data) {
        return res.status(404).json({ error: 'Comanda não encontrada ou já está fechada.' });
    }

    res.json(data);
}

// PUT /comandas/:id/pagar
export const pagarHorarioComanda = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('comandas')
        .update({ horario_pago: true })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return res.status(404).json({ 
                error: 'Comanda não encontrada ou já está fechada. Horário não foi pago.' 
            });
        }
        
        console.error('Erro do Supabase ao pagar horário:', error);
        return res.status(400).json({ error: error.message });
    }

    res.json(data);
}

// PUT /comandas/:id/limpar-quadra
export const limparQuadraComanda = async (req, res) => {
    const { id } = req.params;

    const updates = {
        quadra_id: null,        
        valor_horario: 0,       
        horario_pago: false,    
        horas_reservadas: null  
    };

    const { data, error } = await supabase
        .from('comandas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return res.status(404).json({ 
                error: 'Comanda não encontrada ou já está fechada. Dados da quadra não foram limpos.' 
            });
        }
        
        // Outros erros
        console.error('Erro do Supabase ao limpar dados da quadra:', error);
        return res.status(400).json({ error: error.message });
    }

    res.json(data);
}

// DELETE /comandas/:id
export const deletarComanda = async (req, res) => {
    const { id } = req.params
    const { error } = await supabase
        .from('comandas')
        .delete()
        .eq('id', id)
        .eq('status', 'aberta')

    if (error) return res.status(400).json({ error: error.message })
    res.status(204).send()
}
