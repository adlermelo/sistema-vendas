import React from 'react';

interface TableProps {
  data: Array<{ [key: string]: string | number | null }>;
  columns: string[];
  onEdit?: (item: { [key: string]: string | number | null }) => void;
  onDelete?: (id: number) => void;
}

const Table: React.FC<TableProps> = ({ data, columns, onEdit, onDelete }) => {
  // Função mantida igual
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  // Função mantida igual
  const mapearColunaParaChave = (col: string) => {
    switch (col) {
      case 'Preço': return 'preco';
      case 'Quantidade em Estoque': return 'quantidade_em_estoque';
      case 'Descrição': return 'descricao';
      default: return col.toLowerCase();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th 
                key={col}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => {
                const chave = mapearColunaParaChave(col);
                return (
                  <td 
                    key={col}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {chave === 'preco' ? (
                      <span className="font-medium text-blue-600">
                        {formatarValor(row[chave] as number)}
                      </span>
                    ) : (
                      <span className={chave === 'quantidade_em_estoque' && (row[chave] as number) < 5 ? 'text-red-500 font-medium' : ''}>
                        {row[chave] || '-'}
                      </span>
                    )}
                  </td>
                );
              })}
              {(onEdit || onDelete) && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                        title="Editar"
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id as number)}
                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                        title="Excluir"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;