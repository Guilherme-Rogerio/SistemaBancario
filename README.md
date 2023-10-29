# Desafio Backend - Módulo 2 - Sistema Bancário

## Sobre o Projeto

Este projeto foi desenvolvido como parte do Desafio Backend do Módulo 2 do curso de Desenvolvimento Back-end da Cubos Academy. O objetivo era criar um sistema bancário simples com funcionalidades como criar conta, realizar depósitos, saques, transferências, consultar saldo, entre outras.

## Tecnologias Utilizadas

- Node.js
- Express.js

## Como Usar

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/Guilherme-Rogerio/desafio-backend-modulo-02-sistema-bancario-dbe-t03.git
Instale as dependências:

```bash
npm install
```
Inicie o servidor:

```bash
node index.js
```

Utilize o Postman ou outro cliente HTTP para testar as rotas disponíveis.

Rotas Disponíveis:
```bash
POST /criarConta: Cria uma nova conta.
PUT /atualizarUsuario/:numeroConta: Atualiza informações do usuário.
DELETE /excluirConta/:numeroConta: Exclui uma conta.
POST /depositar: Realiza um depósito em uma conta.
POST /sacar: Realiza um saque em uma conta.
POST /transferir: Realiza uma transferência entre contas.
GET /consultarSaldo: Consulta o saldo de uma conta.
GET /extrato: Obtém o extrato de uma conta.
```
Contribuindo
Fique à vontade para contribuir com melhorias, correções de bugs ou novas funcionalidades. Crie uma pull request e nós ficaremos felizes em analisá-la!

Licença

[![NPM](https://img.shields.io/npm/l/react)](https://github.com/Guilherme-Rogerio/desafio-backend-modulo-02-sistema-bancario-dbe-t03/blob/main/LICENSE)
