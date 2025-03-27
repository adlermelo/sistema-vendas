from pydantic import BaseModel
from typing import Optional

class ClienteBase(BaseModel):
    nome: str
    email: str
    telefone: Optional[str] = None

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(ClienteBase):
    pass

class Cliente(ClienteBase):
    id: int

    class Config:
         from_attributes = True
