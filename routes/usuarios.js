import express from 'express';
import {
    criarUsuario,
    listarUsuarios,
    buscarUsuarioPorCpf
} from '../controllers/usuariosController.js';

const router = express.Router();

router.post('/', criarUsuario);
router.get('/', listarUsuarios);
router.get('/cpf/:cpf', buscarUsuarioPorCpf);

export default router;