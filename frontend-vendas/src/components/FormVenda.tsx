import React, { useState, useEffect } from 'react';
import { Venda } from '../types/Venda';
import api from '../services/api';

interface FormVendaProps {
  onSubmit: (venda: Omit<Venda, 'id'>) => void;
  onCancel: () => void;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade_em_estoque: number;
}

interface Cliente {
  id: number;
  nome: string;
}

interface ProdutoSelecionado {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

const FormVenda: React.FC<FormVendaProps> = ({ onSubmit, onCancel }) => {
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoSelecionado[]>([]);
  const [produtoId, setProdutoId] = useState<number | null>(null);
  const [quantidade, setQuantidade] = useState<number>(1);
  const [listaProdutos, setListaProdutos] = useState<Produto[]>([]);
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [etapa, setEtapa] = useState<'selecao' | 'finalizacao'>('selecao');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produtosResponse, clientesResponse] = await Promise.all([
          api.get<Produto[]>('/produtos/'),
          api.get<Cliente[]>('/clientes/')
        ]);
        setListaProdutos(produtosResponse.data);
        setListaClientes(clientesResponse.data);
      } catch {
        setError('Erro ao carregar dados. Tente recarregar a página.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAdicionarProduto = () => {
    if (!produtoId || quantidade <= 0) {
      setError('Selecione um produto e quantidade válida');
      return;
    }

    const produto = listaProdutos.find(p => p.id === produtoId);
    if (!produto) {
      setError('Produto não encontrado');
      return;
    }

    if (quantidade > produto.quantidade_em_estoque) {
      setError(`Estoque insuficiente (${produto.quantidade_em_estoque} disponíveis)`);
      return;
    }

    // Verifica se o produto já foi adicionado
    const produtoExistenteIndex = produtosSelecionados.findIndex(p => p.id === produtoId);

    if (produtoExistenteIndex >= 0) {
      // Atualiza a quantidade se o produto já existe
      const novosProdutos = [...produtosSelecionados];
      novosProdutos[produtoExistenteIndex].quantidade += quantidade;
      setProdutosSelecionados(novosProdutos);
    } else {
      // Adiciona novo produto
      setProdutosSelecionados([
        ...produtosSelecionados,
        {
          id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: quantidade
        }
      ]);
    }

    // Limpa os campos
    setProdutoId(null);
    setQuantidade(1);
    setError(null);
  };

  const handleRemoverProduto = (id: number) => {
    setProdutosSelecionados(produtosSelecionados.filter(produto => produto.id !== id));
  };

  const handleAlterarQuantidade = (id: number, novaQuantidade: number) => {
    setProdutosSelecionados(produtosSelecionados.map(produto => {
      if (produto.id === id) {
        return { ...produto, quantidade: novaQuantidade };
      }
      return produto;
    }));
  };

  const calcularTotal = () => {
    return produtosSelecionados.reduce((total, produto) => {
      return total + (produto.preco * produto.quantidade);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (produtosSelecionados.length === 0) {
      setError('Adicione pelo menos um produto');
      return;
    }
  
    try {
      // 1. Calcular total
      const total = calcularTotal();
      
      // 2. Preparar dados para enviar
      const vendaData = {
        cliente_id: clienteId || null,
        data_venda: new Date().toISOString().split('T')[0],
        total: total
      };
  
      // 3. Criar a venda
      const response = await api.post<Venda>('/vendas/', vendaData);
      
      // 4. Criar os itens de venda_produto
      await Promise.all(
        produtosSelecionados.map(produto => {
          return api.post('/venda_produto/', {
            venda_id: response.data.id,
            produto_id: produto.id,
            quantidade: produto.quantidade
          });
        })
      );
  
      onSubmit(response.data);
      // Resetar o formulário
      setProdutosSelecionados([]);
      setClienteId(null);
      setError(null);
      setEtapa('selecao');
      
    } catch (error: unknown) {
      console.error('Erro completo:', error);
      
      let errorMessage = 'Erro ao registrar venda';
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: unknown } } };
        console.error('Resposta do erro:', axiosError.response?.data);
        
        if (axiosError.response?.data?.detail) {
          errorMessage += `: ${JSON.stringify(axiosError.response.data.detail)}`;
        }
      } else if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
  
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cliente
          </label>
          <select
            value={clienteId || ''}
            onChange={(e) => setClienteId(Number(e.target.value) || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Selecione um cliente</option>
            {listaClientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome} (ID: {cliente.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {etapa === 'selecao' ? (
        <>
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Produtos</h3>
            
            {produtosSelecionados.length > 0 && (
              <div className="mb-4 border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {produtosSelecionados.map((produto) => (
                      <tr key={produto.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {produto.nome} (ID: {produto.id})
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <input
                            type="number"
                            min="1"
                            value={produto.quantidade}
                            onChange={(e) => handleAlterarQuantidade(produto.id, Math.max(1, Number(e.target.value)))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {produto.preco.toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {(produto.preco * produto.quantidade).toLocaleString('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          })}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <button
                            type="button"
                            onClick={() => handleRemoverProduto(produto.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Produto *
                </label>
                <select
                  value={produtoId || ''}
                  onChange={(e) => {
                    setProdutoId(Number(e.target.value) || null);
                    setError(null);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Selecione um produto</option>
                  {listaProdutos.map(produto => (
                    <option 
                      key={produto.id} 
                      value={produto.id}
                      disabled={produto.quantidade_em_estoque <= 0}
                    >
                      {produto.nome} - 
                      {produto.preco.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      })} - 
                      Estoque: {produto.quantidade_em_estoque}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade *
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleAdicionarProduto}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => setEtapa('finalizacao')}
              disabled={produtosSelecionados.length === 0}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                produtosSelecionados.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Continuar
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Resumo da Venda</h3>
            
            <div className="mb-4 border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantidade</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preço Unit.</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {produtosSelecionados.map((produto) => (
                    <tr key={produto.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {produto.nome} (ID: {produto.id})
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {produto.quantidade}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {produto.preco.toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                        {(produto.preco * produto.quantidade).toLocaleString('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-800">Total:</span>
              <span className="text-xl font-bold text-green-600">
                {calcularTotal().toLocaleString('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                })}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setEtapa('selecao')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Finalizar Venda
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default FormVenda;