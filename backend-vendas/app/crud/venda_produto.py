from sqlalchemy.orm import Session
from app.models.venda_produto import VendaProduto
from app.schemas.venda_produto import VendaProdutoCreate, VendaProdutoUpdate

def get_venda_produto(db: Session, venda_id: int, produto_id: int):
    return db.query(VendaProduto).filter(
        VendaProduto.venda_id == venda_id,
        VendaProduto.produto_id == produto_id
    ).first()

def get_venda_produtos(db: Session, venda_id: int):
    return db.query(VendaProduto).filter(VendaProduto.venda_id == venda_id).all()

def create_venda_produto(db: Session, venda_produto: VendaProdutoCreate):
    db_venda_produto = VendaProduto(**venda_produto.model_dump())
    db.add(db_venda_produto)
    db.commit()
    db.refresh(db_venda_produto)
    return db_venda_produto

def update_venda_produto(
    db: Session, 
    venda_id: int, 
    produto_id: int, 
    venda_produto: VendaProdutoUpdate
):
    db_venda_produto = get_venda_produto(db, venda_id, produto_id)
    if db_venda_produto is None:
        return None
    
    for var, value in vars(venda_produto).items():
        setattr(db_venda_produto, var, value)
    
    db.commit()
    db.refresh(db_venda_produto)
    return db_venda_produto

def delete_venda_produto(db: Session, venda_id: int, produto_id: int):
    db_venda_produto = get_venda_produto(db, venda_id, produto_id)
    if db_venda_produto is None:
        return None
    db.delete(db_venda_produto)
    db.commit()
    return db_venda_produto