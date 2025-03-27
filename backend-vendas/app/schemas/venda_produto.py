from pydantic import BaseModel

class VendaProdutoBase(BaseModel):
    venda_id: int
    produto_id: int
    quantidade: int = 1

class VendaProdutoCreate(VendaProdutoBase):
    pass

class VendaProdutoUpdate(VendaProdutoBase):
    pass

class VendaProduto(VendaProdutoBase):
    class Config:
        from_attributes = True

class VendaProdutoResponse(VendaProduto):
    pass