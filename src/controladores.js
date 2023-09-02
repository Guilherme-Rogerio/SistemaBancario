const bancoDeDados = require('./bancodedados');

function validarContaExistente(numeroConta, res) {
    const conta = bancoDeDados.contas.find((conta) => conta.numero === numeroConta);
    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada' });
    }
    return conta;
}

function validarCPFEmailUnicos(cpf, email, res) {
    const contaExistente = bancoDeDados.contas.find(
        (conta) => (cpf && conta.usuario.cpf === cpf) || (email && conta.usuario.email === email)
    );

    if (contaExistente) {
        return res.status(400).json({ mensagem: 'CPF ou e-mail já cadastrados' });
    }
}

function listarContas(req, res) {
    const { senha_banco } = req.query;

    if (!senha_banco || senha_banco !== bancoDeDados.banco.senha) {
        return res.status(401).json({ mensagem: 'Senha do banco inválida' });
    }

    return res.status(200).json(bancoDeDados.contas);
}

function criarConta(req, res) {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: 'Campos obrigatórios faltando' });
    }

    validarCPFEmailUnicos(cpf, email, res);

    const numeroConta = (bancoDeDados.contas.length + 1).toString();
    const novaConta = {
        numero: numeroConta,
        saldo: 0,
        usuario: { nome, cpf, data_nascimento, telefone, email, senha },
    };

    bancoDeDados.contas.push(novaConta);

    return res.status(201).json({
        numero: numeroConta,
        saldo: 0,
        usuario: novaConta.usuario,
    });
}

function atualizarUsuario(req, res) {
    const { numeroConta } = req.params;
    const { cpf, email, nome, telefone } = req.body;

    const conta = validarContaExistente(numeroConta, res);

    validarCPFEmailUnicos(cpf, email, res);

    let alteracoes = false;

    if (cpf !== undefined && cpf !== conta.usuario.cpf) {
        conta.usuario.cpf = cpf;
        alteracoes = true;
    }

    if (email !== undefined && email !== conta.usuario.email) {
        conta.usuario.email = email;
        alteracoes = true;
    }

    if (nome !== undefined && nome !== conta.usuario.nome) {
        conta.usuario.nome = nome;
        alteracoes = true;
    }

    if (telefone !== undefined && telefone !== conta.usuario.telefone) {
        conta.usuario.telefone = telefone;
        alteracoes = true;
    }

    if (alteracoes) {
        return res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
    } else {
        return res.status(200).json({ mensagem: 'Nenhuma alteração feita' });
    }
}

function excluirConta(req, res) {
    const { numeroConta } = req.params;

    const conta = validarContaExistente(numeroConta, res);

    if (conta.saldo > 0) {
        return res.status(400).json({ mensagem: 'Não é possível excluir conta com saldo positivo' });
    }

    const contaIndex = bancoDeDados.contas.findIndex((conta) => conta.numero === numeroConta);
    bancoDeDados.contas.splice(contaIndex, 1);

    return res.status(200).json({ mensagem: 'Conta excluída com sucesso' });
}

function depositar(req, res) {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || valor === undefined || valor <= 0) {
        return res.status(400).json({ mensagem: 'Parâmetros inválidos' });
    }

    const conta = validarContaExistente(numero_conta, res);

    conta.saldo += valor;

    const transacao = {
        data: new Date().toISOString(),
        numero_conta,
        valor,
    };

    bancoDeDados.depositos.push(transacao);

    return res.status(200).json({ mensagem: 'Depósito realizado com sucesso' });
}

function sacar(req, res) {
    const { numero_conta, valor, senha } = req.body;

    if (!numero_conta || valor === undefined || valor <= 0 || !senha) {
        return res.status(400).json({ mensagem: 'Parâmetros inválidos' });
    }

    const conta = validarContaExistente(numero_conta, res);

    if (conta.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente' });
    }

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    conta.saldo -= valor;

    const transacao = {
        data: new Date().toISOString(),
        numero_conta,
        valor: -valor,
    };

    bancoDeDados.saques.push(transacao);

    return res.status(200).json({ mensagem: 'Saque realizado com sucesso' });
}

function transferir(req, res) {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_origem || !numero_conta_destino || valor === undefined || valor <= 0 || !senha) {
        return res.status(400).json({ mensagem: 'Parâmetros inválidos' });
    }

    const contaOrigem = validarContaExistente(numero_conta_origem, res);
    const contaDestino = validarContaExistente(numero_conta_destino, res);

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    if (contaOrigem.saldo < valor) {
        return res.status(400).json({ mensagem: 'Saldo insuficiente na conta de origem' });
    }

    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;

    const transacao = {
        data: new Date().toISOString(),
        numero_origem: numero_conta_origem,
        numero_destino: numero_conta_destino,
        valor,
    };

    bancoDeDados.transferencias.push(transacao);

    return res.status(200).json({ mensagem: 'Transferência realizada com sucesso' });
}

function consultarSaldo(req, res) {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Parâmetros inválidos' });
    }

    const conta = validarContaExistente(numero_conta, res);

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    return res.status(200).json({ saldo: conta.saldo });
}

function extrato(req, res) {
    const { numero_conta, senha } = req.query;

    if (!numero_conta || !senha) {
        return res.status(400).json({ mensagem: 'Parâmetros inválidos' });
    }

    const conta = validarContaExistente(numero_conta, res);

    if (senha !== conta.usuario.senha) {
        return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    const depositos = bancoDeDados.depositos.filter((transacao) => transacao.numero_conta === numero_conta);
    const saques = bancoDeDados.saques.filter((transacao) => transacao.numero_conta === numero_conta);
    const transferenciasEnviadas = bancoDeDados.transferencias.filter((transacao) => transacao.numero_origem === numero_conta);
    const transferenciasRecebidas = bancoDeDados.transferencias.filter((transacao) => transacao.numero_destino === numero_conta);

    const extrato = {
        saldo: conta.saldo,
        depositos,
        saques,
        transferenciasEnviadas,
        transferenciasRecebidas,
    };

    return res.status(200).json(extrato);
}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    extrato,
};