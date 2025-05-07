import fs from 'fs';
import path from 'path';

// Função para deletar arquivos do uploads relacionados ao post
export function deleteUploadsForPost(post) {
  const uploadDir = path.resolve('uploads');
  const files = [post.imagem, post.pdf, post.video];
  files.forEach(file => {
    if (file && typeof file === 'string') {
      // Remove /uploads/ do início, se houver
      const filePath = file.startsWith('/uploads/') ? file.slice(9) : file;
      const fullPath = path.join(uploadDir, filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, err => {
          if (err) console.error('Erro ao deletar arquivo', fullPath, err);
        });
      }
    }
  });
}
