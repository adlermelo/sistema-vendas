# app/schemas/__init__.py
from .venda import Venda, VendaCreate, VendaUpdate, VendaWithProdutos
from .venda_produto import VendaProduto, VendaProdutoCreate, VendaProdutoUpdate
from .produto import ProdutoBase, ProdutoCreate, ProdutoUpdate, Produto
from .cliente import ClienteBase, ClienteCreate, ClienteUpdate, Cliente

# Exporte apenas o necessário
__all__ = [
    'VendaProdutoBase', 'VendaProdutoCreate', 'VendaProdutoResponse',
    'VendaBase', 'VendaCreate', 'VendaUpdate', 'VendaResponse',
    'ProdutoBase', 'ProdutoCreate', 'ProdutoUpdate', 'Produto',
    'ClienteBase', 'ClienteCreate', 'ClienteUpdate', 'Cliente'
]