from sqlalchemy import Column, Integer, ForeignKey, Float, String, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Venda(Base):
    __tablename__ = 'vendas'

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey('clientes.id'))
    data_venda = Column(Date, default=datetime.now().date())
    total = Column(Float)

    cliente = relationship("Cliente", back_populates="vendas")
    produtos = relationship("VendaProduto", back_populates="venda", cascade="all, delete-orphan")

    def calcular_total(self):
        """Calcula o total baseado nos produtos associados"""
        if self.produtos:
            self.total = sum(
                vp.produto.preco * vp.quantidade 
                for vp in self.produtos
                if vp.produto and vp.produto.preco
            )
        else:
            self.total = 0.0

    def __repr__(self):
        return f"<Venda(id={self.id}, cliente_id={self.cliente_id}, total={self.total})>"