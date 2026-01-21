import express from 'express';
import {
    criarUsuario,
    listarUsuarios,
    buscarUsuarioPorCpf
} from '../controllers/usuariosController.js';

const router = express.Router();

router.post('/usuarios', criarUsuario);
router.get('/usuarios', listarUsuarios);
router.get('/usuarios/cpf/:cpf', buscarUsuarioPorCpf);

export default router;