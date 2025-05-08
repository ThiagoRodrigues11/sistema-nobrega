import React from 'react';

export default function Footer() {
  return (
    <footer style={{ marginTop: 40, padding: 16, background: '#f8f8f8', textAlign: 'center', color: '#888' }}>
      © {new Date().getFullYear()} Nóbrega Confecções. Todos os direitos reservados.
    </footer>
  );
}
