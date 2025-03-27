import React from 'react';

interface DataTableProps {
  headers: string[];
  data: Array<Record<string, any>>;
}

const DataTable: React.FC<DataTableProps> = ({ headers, data }) => {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th 
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {Object.values(row).map((cell, j) => (
                <td 
                  key={j} 
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;