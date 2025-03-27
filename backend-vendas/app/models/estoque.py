# app/models/estoque.py (Produto)
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database import Base

class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    descricao = Column(String, nullable=True)
    preco = Column(Float)
    quantidade_em_estoque = Column(Integer, nullable=False)

    # Relacionamento com a tabela intermediária VendaProduto
    vendas = relationship("VendaProduto", back_populates="produto")

    def __repr__(self):
        return f"<Produto(nome={self.nome}, preco={self.preco}, quantidade={self.quantidade_em_estoque})>"
