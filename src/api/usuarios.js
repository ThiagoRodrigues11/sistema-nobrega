import { get, post, put, del } from './api';

export async function getUsuarios() {
  try {
    const response = await get('/usuarios');
    return response;
  } catch (error) {
    throw new Error('Erro ao buscar usuários');
  }
}

export async function createUsuario(usuario) {
  try {
    const response = await post('/usuarios', usuario);
    return response;
  } catch (error) {
    throw new Error('Erro ao criar usuário');
  }
}

export async function updateUsuario(id, usuario) {
  try {
    const response = await put(`/usuarios/${id}`, usuario);
    return response;
  } catch (error) {
    throw new Error('Erro ao atualizar usuário');
  }
}

export async function deleteUsuario(id) {
  try {
    await del(`/usuarios/${id}`);
  } catch (error) {
    throw new Error('Erro ao deletar usuário');
  }
}
