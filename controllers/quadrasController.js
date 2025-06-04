import { supabase } from '../services/supabaseClient.js'

export const listarQuadras = async (req, res) => {
    const { data, error } = await supabase.from('quadras').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

export const obterQuadra = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('quadras').select('*').eq('id', id).single()
    if (error) return res.status(404).json({ error: 'Quadra não encontrada' })
    res.json(data)
}

export const criarQuadra = async (req, res) => {
    const { nome, tipo, status } = req.body
    const { data, error } = await supabase.from('quadras').insert([{ nome, tipo, status }]).select().single()
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json(data[0])
}

export const atualizarQuadra = async (req, res) => {
    const { id } = req.params
    const { nome, tipo, status } = req.body
    const { data, error } = await supabase
        .from('quadras')
        .update({ nome, tipo, status })
        .eq('id', id)
        .select()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data[0])
}

export const deletarQuadra = async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('quadras').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    res.status(204).send()
}
