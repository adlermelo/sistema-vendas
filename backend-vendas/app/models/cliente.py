# app/models/cliente.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class Cliente(Base):
    __tablename__ = 'clientes'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    telefone = Column(String)
    endereco = Column(String)

    vendas = relationship("Venda", back_populates="cliente")

    def __repr__(self):
        return f"<Cliente(nome={self.nome}, email={self.email})>"
