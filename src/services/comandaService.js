import { supabase } from './supabaseClient.js'

export const comandaService = {
    async listar() {
        const { data, error } = await supabase
            .from('comandas')
            .select('*');
            if (error) throw new Error(Error.message);
            return data;
    },

    async obterPorId(id) {
        const { data, error } = await supabase
            .from('comandas')
            .select('*')
            .eq('id', id)
            .single();

        if(error) throw new Error(`Comanda nao encontrada`);
        return data;
    },

    async criar(dados){
        const novaComanda = {
            nome: dados.nome,
            quadra_id: dados.quadra_id,
            cliente_nome: dados.cliente_nome,
            status: 'aberta', // Força status inicial
            valor_horario: parseFloat(dados.valor_horario) || 0,
            horas_reservadas: dados.horas_reservadas
        }

        const {data, error} = await supabase
            .from('comandas')
            .insert([novaComanda])
            .select()
            .single();

        if(error) throw new Error(error.message);
        return data;
    },

    async fechar(id) {
        const data_fechamento = new Date().toISOString();
        const { data, error } = await supabase
            .from('comandas')
            .update({ status: 'fechada', data_fechamento })
            .eq('id', id)
            .eq('status', 'aberta') 
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    async atualizarHoras(id, horas) {
        const { data, error } = await supabase
            .from('comandas')
            .update({ horas_reservadas: horas })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error('Comanda não encontrada ou erro na atualização');
        return data;
    },

    async pagarHorario(id) {
        const { data, error } = await supabase
            .from('comandas')
            .update({ horario_pago: true })
            .eq('id', id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    },

    async limparQuadra(id) {
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

        if (error) throw new Error(error.message);
        return data;
    },
    
    async deletar(id) {
        const { error } = await supabase
            .from('comandas')
            .delete()
            .eq('id', id)
            .eq('status', 'aberta');

        if (error) throw new Error(error.message);
        return true;
    }


}