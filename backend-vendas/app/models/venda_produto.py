# app/models/venda_produto.py
from sqlalchemy import Column, Integer, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.database import Base

class VendaProduto(Base):
    __tablename__ = 'venda_produto'

    venda_id = Column(Integer, ForeignKey("vendas.id"), primary_key=True)
    produto_id = Column(Integer, ForeignKey("produtos.id"), primary_key=True)
    quantidade = Column(Integer, nullable=False, default=1)
    

    # Relacionamentos
    venda = relationship("Venda", back_populates="produtos")
    produto = relationship("Produto", back_populates="vendas")

    def __repr__(self):
        return (f"<VendaProduto(venda_id={self.venda_id}, "
                f"produto_id={self.produto_id}, "
                f"quantidade={self.quantidade}, "
                f"preco_unitario={self.preco_unitario})>")