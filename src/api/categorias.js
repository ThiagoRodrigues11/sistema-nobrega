import { get, post, put, del } from '../api';

export async function getCategorias() {
  try {
    const response = await get('/categorias');
    return response;
  } catch (error) {
    throw new Error('Erro ao buscar categorias');
  }
}

export async function addCategoria(nome) {
  try {
    const response = await post('/categorias', { nome });
    return response;
  } catch (error) {
    throw new Error('Erro ao adicionar categoria');
  }
}

export async function updateCategoria(id, nome) {
  try {
    const response = await put(`/categorias/${id}`, { nome });
    return response;
  } catch (error) {
    throw new Error('Erro ao atualizar categoria');
  }
}

export async function deleteCategoria(id) {
  try {
    await del(`/categorias/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar categoria');
  }
}