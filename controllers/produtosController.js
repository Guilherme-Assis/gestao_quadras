import { supabase } from '../services/supabaseClient.js'

export const listarProdutos = async (req, res) => {
    const { data, error } = await supabase.from('produtos').select('*')
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
}

export const obterProduto = async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.from('produtos').select('*').eq('id', id).single()
    if (error) return res.status(404).json({ error: 'Produto não encontrado' })
    res.json(data)
}

export const criarProduto = async (req, res) => {
    const { nome, preco_custo, preco_venda, estoque } = req.body
    const { data, error } = await supabase
        .from('produtos')
        .insert([{ nome, preco_custo, preco_venda, estoque }])
        .select()
        .single()
    if (error) return res.status(400).json({ error: error.message })
    res.status(201).json(data)
}

export const atualizarProduto = async (req, res) => {
    const { id } = req.params
    const { nome, preco_custo, preco_venda, estoque, alerta_enviado } = req.body
    const { data, error } = await supabase
        .from('produtos')
        .update({ nome, preco_custo, preco_venda, estoque, alerta_enviado })
        .eq('id', id)
        .select()
        .single()
    if (error) return res.status(400).json({ error: error.message })
    res.json(data)
}

export const deletarProduto = async (req, res) => {
    const { id } = req.params
    const { error } = await supabase.from('produtos').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    res.status(204).send()
}
