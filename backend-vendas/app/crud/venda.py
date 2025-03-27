from sqlalchemy.orm import Session
from app.models.venda import Venda
from app.schemas.venda import VendaCreate, VendaUpdate
from datetime import date

def get_venda(db: Session, venda_id: int):
    return db.query(Venda).filter(Venda.id == venda_id).first()

def get_vendas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Venda).offset(skip).limit(limit).all()

def create_venda(db: Session, venda: VendaCreate):
    db_venda = Venda(
        cliente_id=venda.cliente_id,
        data_venda=venda.data_venda if venda.data_venda else date.today(),
        total=venda.total if venda.total else 0.0
    )
    db.add(db_venda)
    db.commit()
    db.refresh(db_venda)
    return db_venda

def update_venda(db: Session, venda_id: int, venda: VendaUpdate):
    db_venda = get_venda(db, venda_id)
    if db_venda is None:
        return None
    
    for var, value in vars(venda).items():
        if value is not None:
            setattr(db_venda, var, value)
    
    db.commit()
    db.refresh(db_venda)
    return db_venda

def delete_venda(db: Session, venda_id: int):
    db_venda = get_venda(db, venda_id)
    if db_venda is None:
        return None
    db.delete(db_venda)
    db.commit()
    return db_venda