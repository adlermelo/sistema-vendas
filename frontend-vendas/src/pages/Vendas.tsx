import React, { useState, useEffect } from 'react';
import FormVenda from '../components/FormVenda';
import Table from '../components/Table';
import { Venda } from '../types/Venda';
import { getVendas, addVenda, deleteVenda } from '../services/vendaService';

const Vendas: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        setLoading(true);
        const vendas = await getVendas();
        setVendas(vendas);
      } catch (error) {
        setError('Erro ao carregar vendas');
        console.error('Erro ao buscar vendas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendas();
  }, []);

  const handleAdicionarVenda = async (venda: Omit<Venda, 'id'>) => {
    try {
      const novaVenda = await addVenda(venda);
      setVendas([...vendas, novaVenda]);
    } catch (error) {
      setError('Erro ao adicionar venda');
      console.error('Erro ao adicionar venda:', error);
    }
  };

  const handleExcluirVenda = async (id: number) => {
    try {
      await deleteVenda(id);
      setVendas(vendas.filter((v) => v.id !== id));
    } catch (error) {
      setError('Erro ao excluir venda');
      console.error('Erro ao excluir venda:', error);
    }
  };

  const handleCancelarVenda = () => {
    // Esta função será passada para o FormVenda
    // Não precisamos fazer nada aqui pois o FormVenda gerencia seu próprio estado
    console.log('Venda cancelada pelo usuário');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">            
            Ponto de Venda (PDV)
          </h1>
          <p className="text-gray-600">Registro de vendas e transações</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🛒 Nova Venda
          </h2>
          <FormVenda 
            onSubmit={handleAdicionarVenda} 
            onCancel={handleCancelarVenda}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📜 Histórico de Vendas
          </h2>
          <Table
            data={vendas.map((v) => ({
              id: v.id,
              cliente: v.cliente_id ? `Cliente ${v.cliente_id}` : 'Sem cliente',
              data: new Date(v.data_venda).toLocaleDateString('pt-BR'),
              total: v.total?.toLocaleString('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }) || 'R$ 0,00',
              produtos: v.produtos?.join(', ') || ''
            }))}
            columns={['ID', 'Cliente', 'Data', 'Total', 'Produtos']}
            onDelete={handleExcluirVenda}
          />
        </div>
      </div>
    </div>
  );
};

export default Vendas;