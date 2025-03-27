from sqlalchemy.orm import Session
from app import models, schemas

def create_produto(db: Session, produto: schemas.ProdutoCreate):
    """
    Cria um novo produto no banco de dados.
    """
    db_produto = models.Produto(
        nome=produto.nome,
        descricao=produto.descricao,
        preco=produto.preco,
        quantidade_em_estoque=produto.quantidade_em_estoque,
    )
    db.add(db_produto)
    db.commit()
    db.refresh(db_produto)
    return db_produto

def get_produto(db: Session, produto_id: int):
    """
    Retorna um produto pelo ID.
    """
    return db.query(models.Produto).filter(models.Produto.id == produto_id).first()

def get_produtos(db: Session, skip: int = 0, limit: int = 100):
    """
    Retorna uma lista de produtos com paginação.
    """
    return db.query(models.Produto).offset(skip).limit(limit).all()

def update_produto(db: Session, produto_id: int, produto: schemas.ProdutoUpdate):
    db_produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not db_produto:
        return None  # Retorna None se o produto não for encontrado

    # Atualiza apenas os campos fornecidos
    for key, value in produto.dict(exclude_unset=True).items():
        setattr(db_produto, key, value)

    db.commit()
    db.refresh(db_produto)
    return db_produto

def delete_produto(db: Session, produto_id: int):
    """
    Remove um produto do banco de dados.
    """
    db_produto = db.query(models.Produto).filter(models.Produto.id == produto_id).first()
    if not db_produto:
        return None  # Retorna None se o produto não for encontrado

    db.delete(db_produto)
    db.commit()
    return db_produto