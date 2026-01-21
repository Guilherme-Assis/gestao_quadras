import express from "express";
import comandas from "./comandasRoutes.js";
import itens from "./itensRoutes.js";
import produtos from "./produtosRoutes.js";
import quadras from "./quadrasRoutes.js";
import relatorios from "./relatoriosRoutes.js";
import usuarios from "./usuariosRoutes.js";

const routes = (app) => {
    app.route('/').get( (req, res) => {
        res.status(200).send( {titulo: "API quadras"} )
    } )

    app.use(
        express.json(),
        comandas,
        itens,
        produtos,
        quadras,
        relatorios,
        usuarios
    )

}

export default routes;