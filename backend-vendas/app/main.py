from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import date
import logging

# Importações de modelos e schemas
from app import models, schemas
# Importações de CRUD organizadas
from app.crud import (
    cliente as crud_cliente,
    produto as crud_produto,
    venda as crud_venda,
    venda_produto as crud_venda_produto
)
from app.database import SessionLocal, engine

# Cria as tabelas no banco de dados
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Configuração do logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Rotas para Clientes
@app.post("/clientes/", response_model=schemas.Cliente)
def create_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    return crud_cliente.create_cliente(db=db, cliente=cliente)

@app.get("/clientes/{cliente_id}", response_model=schemas.Cliente)
def read_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = crud_cliente.get_cliente(db, cliente_id=cliente_id)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return db_cliente

@app.get("/clientes/", response_model=List[schemas.Cliente])
def read_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_cliente.get_clientes(db=db, skip=skip, limit=limit)

# Rotas para Produtos
@app.post("/produtos/", response_model=schemas.Produto)
def create_produto(produto: schemas.ProdutoCreate, db: Session = Depends(get_db)):
    return crud_produto.create_produto(db=db, produto=produto)

@app.get("/produtos/{produto_id}", response_model=schemas.Produto)
def read_produto(produto_id: int, db: Session = Depends(get_db)):
    db_produto = crud_produto.get_produto(db, produto_id=produto_id)
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto

@app.get("/produtos/", response_model=List[schemas.Produto])
def read_produtos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_produto.get_produtos(db=db, skip=skip, limit=limit)

@app.put("/produtos/{produto_id}", response_model=schemas.Produto)
def update_produto(produto_id: int, produto: schemas.ProdutoUpdate, db: Session = Depends(get_db)):
    db_produto = crud_produto.update_produto(db, produto_id=produto_id, produto=produto)
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto

@app.delete("/produtos/{produto_id}", response_model=schemas.Produto)
def delete_produto(produto_id: int, db: Session = Depends(get_db)):
    db_produto = crud_produto.delete_produto(db, produto_id=produto_id)
    if not db_produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return db_produto

# Rotas para Vendas
@app.post("/vendas/", response_model=schemas.Venda)
def create_venda(venda: schemas.VendaCreate, db: Session = Depends(get_db)):
    try:
        # Garante que a data é hoje se não for fornecida
        if not venda.data_venda:
            venda.data_venda = date.today()
            
        db_venda = models.Venda(
            cliente_id=venda.cliente_id,
            data_venda=venda.data_venda,
            total=venda.total
        )
        
        db.add(db_venda)
        db.commit()
        db.refresh(db_venda)
        return db_venda
    except Exception as e:
        db.rollback()
        logger.error(f"Erro ao criar venda: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/vendas/{venda_id}", response_model=schemas.VendaWithProdutos)
def read_venda(venda_id: int, db: Session = Depends(get_db)):
    db_venda = crud_venda.get_venda(db, venda_id=venda_id)
    if not db_venda:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    
    # Atualiza o total
    db_venda.calcular_total()
    db.commit()
    db.refresh(db_venda)
    
    return db_venda

@app.get("/vendas/", response_model=List[schemas.Venda])
def read_vendas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_venda.get_vendas(db=db, skip=skip, limit=limit)

@app.put("/vendas/{venda_id}", response_model=schemas.Venda)
def update_venda(venda_id: int, venda: schemas.VendaUpdate, db: Session = Depends(get_db)):
    db_venda = crud_venda.update_venda(db, venda_id=venda_id, venda=venda)
    if not db_venda:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return db_venda

@app.delete("/vendas/{venda_id}", response_model=schemas.Venda)
def delete_venda(venda_id: int, db: Session = Depends(get_db)):
    db_venda = crud_venda.delete_venda(db, venda_id=venda_id)
    if not db_venda:
        raise HTTPException(status_code=404, detail="Venda não encontrada")
    return db_venda

# Rotas para VendaProduto
@app.post("/venda_produto/", response_model=schemas.VendaProduto)
def create_venda_produto(
    venda_produto: schemas.VendaProdutoCreate, 
    db: Session = Depends(get_db)
):
    try:
        # Verifica se a venda existe
        venda = crud_venda.get_venda(db, venda_id=venda_produto.venda_id)
        if not venda:
            raise HTTPException(status_code=404, detail="Venda não encontrada")
        
        # Cria a relação
        db_venda_produto = crud_venda_produto.create_venda_produto(db=db, venda_produto=venda_produto)
        
        # Atualiza o total da venda
        venda.calcular_total()
        db.commit()
        
        return db_venda_produto
    except Exception as e:
        db.rollback()
        logger.error(f"Erro ao adicionar produto à venda: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/vendas/{venda_id}/produtos/", response_model=List[schemas.VendaProduto])
def read_venda_produtos(venda_id: int, db: Session = Depends(get_db)):
    return crud_venda_produto.get_venda_produtos(db, venda_id=venda_id)

@app.get("/venda_produto/{venda_id}/{produto_id}", response_model=schemas.VendaProduto)
def read_venda_produto(
    venda_id: int, 
    produto_id: int, 
    db: Session = Depends(get_db)
):
    db_venda_produto = crud_venda_produto.get_venda_produto(db, venda_id=venda_id, produto_id=produto_id)
    if not db_venda_produto:
        raise HTTPException(status_code=404, detail="Relação Venda-Produto não encontrada")
    return db_venda_produto

@app.put("/venda_produto/{venda_id}/{produto_id}", response_model=schemas.VendaProduto)
def update_venda_produto(
    venda_id: int, 
    produto_id: int, 
    venda_produto: schemas.VendaProdutoUpdate, 
    db: Session = Depends(get_db)
):
    db_venda_produto = crud_venda_produto.update_venda_produto(
        db, 
        venda_id=venda_id, 
        produto_id=produto_id, 
        venda_produto=venda_produto
    )
    
    if not db_venda_produto:
        raise HTTPException(status_code=404, detail="Relação Venda-Produto não encontrada")
    
    # Atualiza o total da venda
    venda = crud_venda.get_venda(db, venda_id=venda_id)
    if venda:
        venda.calcular_total()
        db.commit()
    
    return db_venda_produto

@app.delete("/venda_produto/{venda_id}/{produto_id}", response_model=schemas.VendaProduto)
def delete_venda_produto(
    venda_id: int, 
    produto_id: int, 
    db: Session = Depends(get_db)
):
    db_venda_produto = crud_venda_produto.delete_venda_produto(db, venda_id=venda_id, produto_id=produto_id)
    if not db_venda_produto:
        raise HTTPException(status_code=404, detail="Relação Venda-Produto não encontrada")
    
    # Atualiza o total da venda
    venda = crud_venda.get_venda(db, venda_id=venda_id)
    if venda:
        venda.calcular_total()
        db.commit()
    
    return db_venda_produto