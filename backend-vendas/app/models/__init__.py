from app.database import Base  
from .cliente import Cliente
from .estoque import Produto
from .venda import Venda
from .venda_produto import VendaProduto

# Agora o Base estará acessível ao Alembic

