import React, { useState, useEffect } from 'react';
import { Produto } from '../types/Produto';

interface FormProdutoProps {
  onSubmit: (produto: Omit<Produto, 'id'>) => void;
  produtoEditando: Produto | null;
}

const FormProduto: React.FC<FormProdutoProps> = ({ onSubmit, produtoEditando }) => {
  // Estado mantido igual
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState<string | null>(null);
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);

  // useEffect mantido igual
  useEffect(() => {
    if (produtoEditando) {
      setNome(produtoEditando.nome);
      setDescricao(produtoEditando.descricao);
      setPreco(produtoEditando.preco);
      setQuantidade(produtoEditando.quantidade_em_estoque);
    } else {
      setNome('');
      setDescricao(null);
      setPreco(0);
      setQuantidade(0);
    }
  }, [produtoEditando]);

  // handleSubmit mantido igual
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nome, descricao, preco, quantidade_em_estoque: quantidade });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo Nome */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto *
          </label>
          <input
            type="text"
            placeholder="Digite o nome do produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Campo Descrição */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            placeholder="Descrição detalhada do produto"
            value={descricao || ''}
            onChange={(e) => setDescricao(e.target.value || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
          />
        </div>

        {/* Campo Preço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço (R$) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={preco}
              onChange={(e) => setPreco(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Campo Quantidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade em Estoque *
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      {/* Botão de Submit */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {produtoEditando ? 'Atualizar Produto' : 'Adicionar Produto'}
        </button>
      </div>
    </form>
  );
};

export default FormProduto;