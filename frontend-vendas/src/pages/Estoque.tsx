import React, { useState, useEffect } from 'react';
import FormProduto from '../components/FormProduto';
import Table from '../components/Table';
import { Produto } from '../types/Produto';
import { getProdutos, addProduto, updateProduto, deleteProduto } from '../services/estoqueService';

const Estoque: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  // Buscar produtos (mantido igual)
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const produtos = await getProdutos();
        setProdutos(produtos);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    };
    fetchProdutos();
  }, []);

  // Adicionar/editar produto (mantido igual)
  const handleAdicionarProduto = async (produto: Omit<Produto, 'id'>) => {
    try {
      if (produtoEditando && produtoEditando.id) {
        const produtoAtualizado = await updateProduto(produtoEditando.id, produto);
        setProdutos(produtos.map(p => (p.id === produtoEditando.id ? produtoAtualizado : p)));
        setProdutoEditando(null);
      } else {
        const novoProduto = await addProduto(produto);
        setProdutos([...produtos, novoProduto]);
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  // Excluir produto (mantido igual)
  const handleExcluirProduto = async (id: number) => {
    try {
      await deleteProduto(id);
      setProdutos(produtos.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };

  // Editar produto (mantido igual)
  const handleEditarProduto = (produto: { [key: string]: string | number | null }) => {
    if (
      typeof produto.id === 'number' &&
      typeof produto.nome === 'string' &&
      (typeof produto.descricao === 'string' || produto.descricao === null) &&
      typeof produto.preco === 'number' &&
      typeof produto.quantidade_em_estoque === 'number'
    ) {
      const produtoEditado: Produto = {
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        quantidade_em_estoque: produto.quantidade_em_estoque,
      };
      setProdutoEditando(produtoEditado);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Cabeçalho Premium */}
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestão de Estoque
          </h1>
          <p className="text-gray-600">Controle completo do seu inventário</p>
        </header>

        {/* Formulário com Design Aprimorado */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {produtoEditando ? '✏️ Editar Produto' : '➕ Adicionar Produto'}
          </h2>
          <FormProduto
            onSubmit={handleAdicionarProduto}
            produtoEditando={produtoEditando}
          />
        </div>

        {/* Tabela com Container Estilizado */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <Table
            data={produtos.map(p => ({
              id: p.id,
              nome: p.nome,
              descricao: p.descricao || 'Sem descrição',
              preco: p.preco,
              quantidade_em_estoque: p.quantidade_em_estoque || 0,
            }))}
            columns={['ID', 'Nome', 'Descrição', 'Preço', 'Quantidade em Estoque']}
            onEdit={handleEditarProduto}
            onDelete={handleExcluirProduto}
          />
        </div>
      </div>
    </div>
  );
};

export default Estoque;