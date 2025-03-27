from pydantic import BaseModel
from datetime import date
from typing import List, Optional
from pydantic import ConfigDict

class VendaProduto(BaseModel):
    venda_id: int
    produto_id: int
    quantidade: int = 1
    model_config = ConfigDict(from_attributes=True)

class VendaBase(BaseModel):
    #cliente_id: int
    cliente_id: Optional[int] = None  # Tornando opcional se for o caso
    data_venda: Optional[date] = None
    total: Optional[float] = None

class VendaCreate(VendaBase):
    pass

class VendaUpdate(VendaBase):
    pass

class Venda(VendaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class VendaWithProdutos(Venda):
    produtos: List[VendaProduto] = []

# Resolve a referência circular após a definição
from .venda_produto import VendaProduto
VendaWithProdutos.model_rebuild()