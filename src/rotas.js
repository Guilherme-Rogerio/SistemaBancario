const express = require('express');
const router = express.Router();
const controladores = require('./controladores');

router.get('/contas', controladores.listarContas);
router.post('/contas', controladores.criarConta);
router.put('/contas/:numeroConta/usuario', controladores.atualizarUsuario);
router.delete('/contas/:numeroConta', controladores.excluirConta);
router.post('/transacoes/depositar', controladores.depositar);
router.post('/transacoes/sacar', controladores.sacar);
router.post('/transacoes/transferir', controladores.transferir);
router.get('/contas/saldo', controladores.consultarSaldo);
router.get('/contas/extrato', controladores.extrato);

module.exports = router;