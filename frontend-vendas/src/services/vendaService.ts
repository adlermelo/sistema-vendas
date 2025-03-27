import api from './api';
import { Venda } from '../types/Venda';

export const getVendas = async (): Promise<Venda[]> => {
  try {
    const response = await api.get('/vendas/');  // Note a barra no final
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    throw new Error('Falha ao carregar vendas');
  }
};

export const addVenda = async (venda: Omit<Venda, 'id'>): Promise<Venda> => {
  try {
    const response = await api.post('/vendas/', venda, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar venda:', error);
    throw new Error('Falha ao registrar venda');
  }
};

export const deleteVenda = async (id: number): Promise<void> => {
  try {
    await api.delete(`/vendas/${id}`);
  } catch (error) {
    console.error('Erro ao excluir venda:', error);
    throw new Error('Falha ao excluir venda');
  }
};