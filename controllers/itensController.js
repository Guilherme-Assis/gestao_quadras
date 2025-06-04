import { supabase } from '../services/supabaseClient.js'
import { enviarMensagemWhatsApp } from '../services/whatsappService.js'

// POST /itens
export const adicionarItem = async (req, res) => {
    const { comanda_id, produto_id, quantidade, observacao } = req.body

    // Buscar preco_venda do produto
    const { data: produto, error: erroProduto } = await supabase
        .from('produtos')
        .select('preco_venda, estoque, nome, alerta_enviado')
        .eq('id', produto_id)
        .single()

    if (erroProduto || !produto) {
        return res.status(404).json({ error: 'Produto não encontrado' })
    }

    // Verificar estoque suficiente
    if (produto.estoque < quantidade) {
        return res.status(400).json({ error: `Estoque insuficiente. Disponível: ${produto.estoque}` })
    }

    const preco_unitario = produto.preco_venda

    // Inserir item
    const { data: novoItem, error: erroInsercao } = await supabase
        .from('itens_comanda')
        .insert([{ comanda_id, produto_id, quantidade, preco_unitario, observacao }])
        .select()
        .single()

    if (erroInsercao) return res.status(400).json({ error: erroInsercao.message })

    // Atualizar estoque do produto
    const novoEstoque = produto.estoque - quantidade

    await supabase
        .from('produtos')
        .update({ estoque: novoEstoque })
        .eq('id', produto_id)

    // Enviar alerta se estoque baixo e ainda não avisado
    if (novoEstoque <= 5 && !produto.alerta_enviado) {
        await enviarMensagemWhatsApp(
            '5534991448852',
            `⚠️ Estoque baixo: ${produto.nome} com apenas ${novoEstoque} unidades restantes.`
        )

        await supabase
            .from('produtos')
            .update({ alerta_enviado: true })
            .eq('id', produto_id)
    }

    // Atualizar total da comanda
    await atualizarTotalComanda(comanda_id)

    res.status(201).json(novoItem)
}


// PUT /itens/:id
export const atualizarItem = async (req, res) => {
    const { id } = req.params
    const { quantidade, observacao } = req.body

    // Buscar item atual (antes da atualização)
    const { data: itemAtual, error: erroItem } = await supabase
        .from('itens_comanda')
        .select('quantidade, produto_id, comanda_id')
        .eq('id', id)
        .single()

    if (erroItem || !itemAtual) {
        return res.status(404).json({ error: 'Item não encontrado' })
    }

    const { produto_id, comanda_id } = itemAtual

    // Buscar produto
    const { data: produto, error: erroProduto } = await supabase
        .from('produtos')
        .select('preco_venda, estoque, alerta_enviado, nome')
        .eq('id', produto_id)
        .single()

    if (erroProduto || !produto) {
        return res.status(404).json({ error: 'Produto não encontrado' })
    }

    // Ajuste no estoque = estoque atual + quantidade antiga - nova
    const novoEstoque = produto.estoque + itemAtual.quantidade - quantidade

    if (novoEstoque < 0) {
        return res.status(400).json({ error: `Estoque insuficiente. Disponível: ${produto.estoque}` })
    }

    // Atualizar item
    const preco_unitario = produto.preco_venda

    const { data, error } = await supabase
        .from('itens_comanda')
        .update({ quantidade, preco_unitario, observacao })
        .eq('id', id)
        .select()
        .single()

    if (error) return res.status(400).json({ error: error.message })

    // Atualizar estoque
    await supabase
        .from('produtos')
        .update({ estoque: novoEstoque })
        .eq('id', produto_id)

    // Reenviar alerta se necessário
    if (novoEstoque <= 5 && !produto.alerta_enviado) {
        await enviarMensagemWhatsApp(
            '5534991448852',
            `⚠️ Estoque baixo: ${produto.nome} com ${novoEstoque} unidades.`
        )
        await supabase
            .from('produtos')
            .update({ alerta_enviado: true })
            .eq('id', produto_id)
    }

    // Recalcular total
    await atualizarTotalComanda(comanda_id)

    res.json(data)
}

// DELETE /itens/:id
export const deletarItem = async (req, res) => {
    const { id } = req.params

    // Buscar item antes de deletar
    const { data: item, error: erroItem } = await supabase
        .from('itens_comanda')
        .select('comanda_id, produto_id, quantidade')
        .eq('id', id)
        .single()

    if (erroItem || !item) {
        return res.status(404).json({ error: 'Item não encontrado' })
    }

    const { produto_id, quantidade, comanda_id } = item

    // Atualizar estoque (devolve a quantidade)
    const { data: produto, error: erroProduto } = await supabase
        .from('produtos')
        .select('estoque')
        .eq('id', produto_id)
        .single()

    if (!erroProduto && produto) {
        const novoEstoque = produto.estoque + quantidade
        await supabase.from('produtos').update({ estoque: novoEstoque }).eq('id', produto_id)
    }

    // Excluir item
    const { error } = await supabase.from('itens_comanda').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })

    // Recalcular total da comanda
    await atualizarTotalComanda(comanda_id)

    res.status(204).send()
}


// GET /itens/comanda/:comanda_id
export const listarItensDaComanda = async (req, res) => {
    const { comanda_id } = req.params

    const { data, error } = await supabase
        .from('itens_comanda')
        .select('*, produto:produto_id(nome, preco_custo, preco_venda)')
        .eq('comanda_id', comanda_id)

    if (error) return res.status(500).json({ error: error.message })
    res.status(200).json(data)
}

const atualizarTotalComanda = async (comanda_id) => {
    const { data: itens, error: erroItens } = await supabase
        .from('itens_comanda')
        .select('quantidade, preco_unitario')
        .eq('comanda_id', comanda_id)

    if (erroItens) return

    const total = itens.reduce((sum, item) => sum + item.quantidade * item.preco_unitario, 0)

    await supabase
        .from('comandas')
        .update({ total })
        .eq('id', comanda_id)
}
