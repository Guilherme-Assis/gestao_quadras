import { comandaService } from '../services/comandaService.js'

export const listarComandas = async (req, res) => {
    try {
        const comandas = await comandaService.listar();
        res.json(comandas)
    } catch (error) {
        res.status(500).json( { error: error.message} );
    }
}

export const obterComanda = async (req, res) => {
    try {
        const { id } = req.params;
        const comanda = await comandaService.obterPorId(id);
        res.json(comanda);
    } catch (error) {
        res.status(404).json( {error: error.message} );
    }
}

export const criarComanda = async (req, res) => {
    try {
        const comanda = await comandaService.criar(req.body);
        res.status(201).json(comanda);
    } catch(error) {
        res.status(400).json( {error: error.message} );
    }
}

export const fecharComanda = async (req, res) => {
    try {
        const { id } = req.params;
        const comanda = await comandaService.fechar(id);
        res.json(comanda);
    } catch(error) {
        res.status(400).json( {error: error.message} );
    }
    
}

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

    try {
        const data = await comandaService.atualizarHoras(id, horasParseadas);
        res.json(data);
    } catch(error) {
        res.status(400).json( {error: error.message} );
    }
}

export const pagarHorarioComanda = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await comandaService.pagarHorario(id);
        res.json(data);
    } catch (error) {
        if (error.message === 'Comanda não encontrada') {
            return res.status(404).json({ error: 'Comanda não encontrada ou já está fechada.' });
        }
        
        return res.status(400).json({ error: error.message });
    }
}

export const limparQuadraComanda = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await comandaService.limparQuadra(id);
        res.json(data);
    } catch (error) {
        if (error.message === 'Comanda não encontrada') {
            return res.status(404).json({ error: 'Comanda não encontrada ou já está fechada.' });
        }
        
        return res.status(400).json({ error: error.message });
    }
}

export const deletarComanda = async (req, res) => {
    const { id } = req.params;

    try {
        await comandaService.deletar(id);
        res.status(204).send(); 
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
