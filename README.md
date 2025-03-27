# Sistema de Gestão de Vendas

![Banner do Sistema](./images/banner-sistema.png)

> Sistema completo para gestão de vendas com backend API Python e frontend React moderno

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Capturas de Tela](#-capturas-de-tela)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)
- [Testes](#-testes)
- [Licença](#-licença)

## 🌟 Visão Geral

Sistema modular para gestão de vendas composto por:

- **Backend**: API RESTful em Python (FastAPI)
- **Frontend**: Interface responsiva com React + TypeScript
- **Banco de Dados**: PostgreSQL/SQLite

## 📸 Capturas de Tela

### Versão Desktop
| Página | Screenshot |
|--------|-----------|
| **Dashboard** | ![Dashboard Desktop](./images/img-sistema-gestor-vendas-1.png) |
| **Vendas** | ![Vendas Desktop](./images/img-sistema-gestor-vendas-2.png) |
| **Vendas/Pt.2** | ![Vendas Desktop](./images/img-sistema-gestor-vendas-3.png) |
| **Estoque** | ![Estoque Desktop](./images/img-sistema-gestor-vendas-4.png) |
| **Relatórios** | ![Relatórios Desktop](./images/img-sistema-gestor-vendas-5.png) |

### Versão Mobile
| Página | Screenshot |
|--------|-----------|
| **Dashboard** | ![Dashboard Mobile](./images/img-sistema-gestor-vendas-mobi-1.png) |
| **Vendas** | ![Vendas Mobile](./images/img-sistema-gestor-vendas-mobi-2.png) |
| **Vendas/Pt.2** | ![Vendas Mobile](./images/img-sistema-gestor-vendas-mobi-3.png) |
| **Estoque** | ![Estoque Mobile](./images/img-sistema-gestor-vendas-mobi-4.png) |
| **Relatórios** | ![Relatórios Mobile](./images/img-sistema-gestor-vendas-mobi-5.png) |

## 🎯 Funcionalidades Principais

- 📊 Dashboard analítico
- 📦 Gestão de estoque
- 💰 Registro de vendas
- 📈 Relatórios gerenciais
- 📱 Design responsivo

## 💻 Tecnologias Utilizadas

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy
- PostgreSQL

### Frontend
- React 18+
- TypeScript
- Vite
- TailwindCSS

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/sistema-vendas.git
cd sistema-vendas
```

2. Configure o backend:
```bash
cd backend-vendas
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

3. Configure o frontend:
```bash
cd ../frontend-vendas
npm install
```

## ⚙️ Configuração

### Backend
Crie um arquivo `.env` na pasta `backend-vendas` com o seguinte conteúdo:

```ini
DATABASE_URL=postgresql://user:password@localhost:5432/db_vendas
SECRET_KEY=suachavesecreta
DEBUG=True
```

### Frontend
Crie um arquivo `.env` na pasta `frontend-vendas` com o seguinte conteúdo:

```ini
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Sistema de Vendas
```

## 🚀 Execução

### Backend
```bash
cd backend-vendas
alembic upgrade head
uvicorn main:app --reload
```
A API estará disponível em: [http://localhost:8000](http://localhost:8000)

### Frontend
```bash
cd ../frontend-vendas
npm run dev
```
O frontend estará disponível em: [http://localhost:3000](http://localhost:3000)

## 📂 Estrutura do Projeto

```
sistema-vendas/
├── backend-vendas/
│   ├── app/
│   │   ├── core/
│   │   ├── modules/
│   │   │   ├── produtos/
│   │   │   ├── vendas/
│   │   │   └── auth/
│   │   ├── db/
│   │   └── main.py
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   └── alembic.ini
├── frontend-vendas/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── images/
│   ├── banner-sistema.png
│   ├── diagrama.png
│   └── screenshots/
│       ├── login.png
│       ├── produtos.png
│       └── vendas.png
└── README.md
```

## 📚 Documentação

A API segue o padrão OpenAPI (Swagger). Acesse a documentação interativa em:

[http://localhost:8000/docs](http://localhost:8000/docs)

Exemplo de endpoints:

- `GET /api/produtos` - Lista todos os produtos
- `POST /api/vendas` - Cria nova venda
- `GET /api/relatorios/vendas` - Gera relatório de vendas

## 🧪 Testes

### Backend
```bash
cd backend-vendas
pytest
```

### Frontend
```bash
cd frontend-vendas
npm run test
```

## 📝 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

