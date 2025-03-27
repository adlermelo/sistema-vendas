import api from './api';
import { Produto } from '../types/Produto';

// Buscar todos os produtos
export const getProdutos = async (): Promise<Produto[]> => {
  const response = await api.get('/produtos');
  return response.data;
};

// Adicionar um novo produto
export const addProduto = async (produto: Omit<Produto, 'id'>): Promise<Produto> => {
  const response = await api.post('/produtos', produto);
  return response.data;
};

// Editar um produto existente
export const updateProduto = async (id: number, produto: Omit<Produto, 'id'>): Promise<Produto> => {
  const response = await api.put(`/produtos/${id}`, produto);
  return response.data;
};

// Excluir um produto
export const deleteProduto = async (id: number): Promise<void> => {
  await api.delete(`/produtos/${id}`);
};