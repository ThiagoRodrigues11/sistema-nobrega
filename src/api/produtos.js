import { get, post, put, del } from '../api';

export async function getProducts() {
  try {
    const response = await get('/produtos');
    return response;
  } catch (error) {
    throw new Error('Erro ao buscar produtos');
  }
}

export async function getProductById(id) {
  try {
    const response = await get(`/produtos/${id}`);
    return response;
  } catch (error) {
    throw new Error('Erro ao buscar produto');
  }
}

export async function createProduct(product) {
  try {
    const response = await post('/produtos', product);
    return response;
  } catch (error) {
    throw new Error('Erro ao criar produto');
  }
}

export async function updateProduct(id, product) {
  try {
    const response = await put(`/produtos/${id}`, product);
    return response;
  } catch (error) {
    throw new Error('Erro ao atualizar produto');
  }
}

export async function deleteProduct(id) {
  try {
    await del(`/produtos/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar produto');
  }
}