export interface Venda {
  id: number;
  cliente_id: number | null;
  data_venda: string;
  total: number;
  produtos: number[]; // Apenas os IDs dos produtos
}

// Tipo adicional quando precisar dos detalhes completos
export interface VendaDetalhada extends Omit<Venda, 'produtos'> {
  produtos: Array<{
    produto_id: number;
    quantidade: number;
    preco_unitario: number;
    nome?: string; // Opcional
  }>;
}