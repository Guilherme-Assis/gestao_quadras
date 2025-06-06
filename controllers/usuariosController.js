import { supabase } from '../services/supabaseClient.js';

// POST /usuarios
export const criarUsuario = async (req, res) => {
    const { nome, cpf, telefone } = req.body;

    const { data, error } = await supabase
        .from('usuarios')
        .insert([{ nome, cpf, telefone }])
        .select()
        .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
};

// GET /usuarios
export const listarUsuarios = async (req, res) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*');

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
};

// GET /usuarios/cpf/:cpf
export const buscarUsuarioPorCpf = async (req, res) => {
    const { cpf } = req.params;

    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('cpf', cpf)
        .single();

    if (error) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(data);
};