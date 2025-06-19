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
    const { nome, quadra_id, cliente_nome, valor_horario } = req.body;

    const { data, error } = await supabase
        .from('comandas')
        .insert([{
            nome,
            quadra_id,
            cliente_nome,
            status: 'aberta',
            valor_horario: parseFloat(valor_horario) || 0
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
