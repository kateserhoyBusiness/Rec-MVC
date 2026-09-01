# EventHub - MVC

Aplicação web de gestão de eventos com autenticação de usuários, criação/edição de eventos e inscrição de participantes.

## Descrição

EventHub é uma aplicação Node.js + Express que permite:
- Usuários se registrarem como participantes ou organizadores
- Organizadores criarem, editarem e excluírem eventos
- Participantes visualizarem eventos e se inscreverem
- Organizadores gerenciarem inscrições

## Tecnologias

- **Node.js** com Express
- **MySQL** para persistência de dados
- **EJS** para templates
- **bcryptjs** para hash de senhas
- **express-session** para autenticação

## Instalação

### Pré-requisitos

- Node.js (v14+)
- MySQL (local ou Aiven)

### Setup

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env` com os dados do seu banco:
   ```
   DB_HOST=seu_host
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=seu_banco
   PORT=3000
   SESSION_SECRET=sua_chave_secreta
   ```

4. Crie o banco de dados executando o schema SQL (ver abaixo)

5. Inicie o servidor:
   ```bash
   npm run dev
   ```

O aplicativo estará disponível em `http://localhost:3000`


## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DB_HOST` | Host do MySQL | `mysql-xxxxx.a.aivencdn.com` |
| `DB_USER` | Usuário MySQL | `avnadmin` |
| `DB_PASSWORD` | Senha MySQL | `xxxxx` |
| `DB_NAME` | Nome do banco | `eventhub` |
| `PORT` | Porta do servidor | `3000` |
| `SESSION_SECRET` | Chave para sessões | `sua_chave_secreta_longa` |

## Usando com Aiven MySQL

1. Crie uma instância MySQL free tier em https://aiven.io
2. Obtenha os dados de conexão (host, user, password, database)
3. Configure o `.env` com esses dados
4. Use `NODE_ENV=production` quando conectar via Aiven para ativar SSL

## Estrutura do Projeto

```
eventhub-mvc/
├── config/               # Configuração do banco
├── controllers/          # Lógica das rotas
├── middlewares/          # Autenticação e tratamento de erro
├── models/               # Acesso ao banco
├── routes/               # Definição das rotas
├── views/                # Templates EJS
├── server.js             # Arquivo principal
├── package.json
└── .env                  # Variáveis de ambiente
```

## Rotas Principais

- `GET /` → Redireciona para `/eventos`
- `GET /login` → Página de login
- `POST /login` → Faz login
- `GET /registro` → Página de registro
- `POST /registro` → Registra novo usuário
- `GET /logout` → Faz logout
- `GET /eventos` → Lista todos os eventos
- `GET /eventos/:id` → Detalhe do evento
- `GET /eventos/novo` → Formulário criar evento (organizador)
- `POST /eventos/novo` → Cria evento (organizador)
- `GET /eventos/:id/editar` → Edita evento (organizador)
- `POST /eventos/:id/editar` → Salva edição (organizador)
- `POST /eventos/:id/excluir` → Exclui evento (organizador)
- `POST /inscricoes/:id` → Participa do evento (participante)

## Deploy no Render

1. Crie um repositório GitHub com o código
2. Vá para https://render.com e crie um novo Web Service
3. Conecte seu repositório GitHub
4. Configure:
   - Build: `npm install`
   - Start: `node server.js`
5. Adicione as variáveis de ambiente (mesmo do `.env`)
6. Faça deploy

## Segurança

- Senhas são hasheadas com bcryptjs (10 rounds)
- Sessões usam cookies httpOnly
- Queries usam prepared statements para evitar SQL injection
- Validação de entrada em todos os formulários
- Verificação de permissões nos controllers

## Limitações

- Sem implementação de email de confirmação
- Sem recuperação de senha
- Sem upload de imagens
- Sem paginação em listas grandes

---

**Autor**: Seu Nome  
**Data**: 2024
