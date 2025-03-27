import React, { useState, useEffect } from 'react';
import { getVendas } from '../services/vendaService';
import { getProdutos } from '../services/estoqueService';
import { 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers,
  FiTrendingUp,
  FiCalendar,
  FiPieChart,
  FiArrowUpRight
} from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [valorTotalVendas, setValorTotalVendas] = useState(0);
  const [clientesAtivos, setClientesAtivos] = useState(0);

  // Dados para os gráficos
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  const vendasMensais = [12000, 19000, 15000, 22000, 18000, 25000];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const vendas = await getVendas();
        const produtos = await getProdutos();
        
        setTotalVendas(vendas.length);
        setTotalProdutos(produtos.length);
        setValorTotalVendas(
          vendas.reduce((total, venda) => total + venda.total, 0)
        );
        setClientesAtivos(42);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  // Componente de gráfico de área simplificado
  const AreaChart = ({ data, labels, color }: { data: number[], labels: string[], color: string }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;
    
    return (
      <div className="h-64 relative">
        <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path
              d={`M0,100 ${
                data.map((value, i) => 
                  `L${(i * 100)/(data.length-1)},${100 - ((value - minValue)/range)*100}`
                ).join(' ')
              } L100,100 Z`}
              fill={`url(#${color}Gradient)`}
              stroke={color}
              strokeWidth="2"
            />
            <defs>
              <linearGradient id={`${color}Gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between">
          {labels.map((label, i) => (
            <span key={i} className="text-xs text-gray-500" style={{ 
              transform: `translateX(${i === 0 ? '0' : i === labels.length-1 ? '0' : '-50%'})`,
              left: `${(i * 100)/(labels.length-1)}%`,
              position: i === 0 ? 'relative' : i === labels.length-1 ? 'relative' : 'absolute'
            }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Componente de gráfico de barras horizontais
  const HorizontalBarChart = ({ data, labels, colors }: { data: number[], labels: string[], colors: string[] }) => {
    const maxValue = Math.max(...data);
    
    return (
      <div className="h-64 space-y-3 py-2">
        {data.map((value, i) => (
          <div key={i} className="flex items-center">
            <span className="text-xs text-gray-600 w-16">{labels[i]}</span>
            <div className="flex-1 mx-2">
              <div 
                className="h-6 rounded-full"
                style={{ 
                  width: `${(value/maxValue)*100}%`,
                  backgroundColor: colors[i]
                }}
              ></div>
            </div>
            <span className="text-xs font-medium w-12 text-right">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-sans">Dashboard Geral</h1>
        <p className="text-gray-600 mt-2">Visão completa do seu negócio</p>
      </header>
      
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card de Vendas */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Vendas (30 dias)</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">{totalVendas}</p>
              <p className="text-sm text-green-500 mt-1 flex items-center">
                <FiTrendingUp className="mr-1" /> 12% vs último mês
              </p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <FiDollarSign className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Card de Valor Total */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Valor Total</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">
                {valorTotalVendas.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
              <p className="text-sm text-green-500 mt-1 flex items-center">
                <FiTrendingUp className="mr-1" /> 8% vs último mês
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-green-600">
              <FiPieChart className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Card de Estoque */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Produtos em Estoque</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">{totalProdutos}</p>
              <p className="text-sm text-blue-500 mt-1 flex items-center">
                <FiTrendingUp className="mr-1" /> 5 novos esta semana
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
              <FiShoppingBag className="text-2xl" />
            </div>
          </div>
        </div>

        {/* Card de Clientes */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Clientes Ativos</p>
              <p className="text-3xl font-bold mt-2 text-gray-900">{clientesAtivos}</p>
              <p className="text-sm text-amber-500 mt-1 flex items-center">
                <FiTrendingUp className="mr-1" /> 3 novos hoje
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <FiUsers className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Área - Vendas Mensais */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Vendas Mensais</h2>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-2" />
              Últimos 6 meses
            </div>
          </div>
          <div className="mt-6">
            <AreaChart 
              data={vendasMensais} 
              labels={meses} 
              color="#6366F1" // indigo-500
            />
          </div>
          <div className="mt-4 flex justify-between text-xs text-gray-500">
            <span>Min: {Math.min(...vendasMensais).toLocaleString()}</span>
            <span>Média: {(vendasMensais.reduce((a,b) => a+b, 0)/vendasMensais.length).toLocaleString()}</span>
            <span>Max: {Math.max(...vendasMensais).toLocaleString()}</span>
          </div>
        </div>

        {/* Gráfico de Barras Horizontais - Desempenho por Categoria */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Categorias</h2>
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="mr-2" />
              Este mês
            </div>
          </div>
          <div className="mt-6">
            <HorizontalBarChart 
              data={[120, 85, 60, 45, 30]} 
              labels={['Perfumaria', 'Cosmeticos', 'Beleza', 'Skins', 'Maquiagem']}
              colors={['#6366F1', '#8B5CF6', '#EC4899', '#F97316', '#10B981']}
            />
          </div>
        </div>
      </div>

      {/* Tabela de Últimas Vendas */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Últimas Vendas</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
            Ver todas <FiArrowUpRight className="ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cliente A</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10/05/2023</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Concluído
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">R$ 150,00</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1002</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cliente B</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">09/05/2023</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Concluído
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">R$ 230,00</td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#1003</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Cliente C</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08/05/2023</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pendente
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">R$ 320,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;