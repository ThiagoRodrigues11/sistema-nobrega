import { get, post, put, del } from './api';

export async function getCategoriasProduto() {
  try {
    const response = await get('/categorias-produto');
    return response;
  } catch (error) {
    throw new Error('Erro ao buscar categorias de produto');
  }
}

export async function createCategoriaProduto(categoria) {
  try {
    const response = await post('/categorias-produto', categoria);
    return response;
  } catch (error) {
    throw new Error('Erro ao criar categoria de produto');
  }
}

export async function updateCategoriaProduto(id, categoria) {
  try {
    const response = await put(`/categorias-produto/${id}`, categoria);
    return response;
  } catch (error) {
    throw new Error('Erro ao atualizar categoria de produto');
  }
}

export async function deleteCategoriaProduto(id) {
  try {
    await del(`/categorias-produto/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar categoria de produto');
  }
}
