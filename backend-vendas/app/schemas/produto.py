from pydantic import BaseModel, Field
from typing import Optional

# Classe base para Produto, que contém os campos comuns
class ProdutoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    preco: float
    quantidade_em_estoque: int = Field(default=0)  # Não permite valores None

# Classe de criação de Produto
class ProdutoCreate(ProdutoBase):
    pass

# Classe de atualização de Produto
class ProdutoUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    preco: Optional[float] = None
    quantidade_em_estoque: Optional[int] = None  # Permite valores None para atualizações parciais

# Classe de Produto (com id e com compatibilidade com ORM)
class Produto(ProdutoBase):
    id: int

    class Config:
        from_attributes = True  # Habilita a compatibilidade com ORMs como SQLAlchemy