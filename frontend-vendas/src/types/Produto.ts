export interface Produto {
  id: number; 
  nome: string;
  descricao: string | null;
  preco: number;
  quantidade_em_estoque: number;
}