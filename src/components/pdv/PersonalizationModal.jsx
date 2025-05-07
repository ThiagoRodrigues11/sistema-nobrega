import React, { useState } from 'react';
import styles from './PDV.module.css';

const locais = [
  'Manga Direita', 'Manga Esquerda', 'Peito', 'Costas', 'Frente', 'Lateral'
];
const tipos = [
  { label: 'Sublimação', value: 'sublimacao' },
  { label: 'Serigrafia', value: 'serigrafia' },
  { label: 'Emborrachado', value: 'emborrachado' },
  { label: 'Bordado', value: 'bordado' },
  { label: 'DTF', value: 'dtf' }
];
const tamanhos = [
  { label: 'A4', value: 'A4' },
  { label: 'A3', value: 'A3' },
  { label: 'A 1/2', value: 'A1/2' },
  { label: 'Escudo', value: 'Escudo' }
];

// Valores base para cada tipo/tamanho
const valoresBase = {
  sublimacao: { A4: 10, A3: 15, 'A1/2': 7, Escudo: 5 },
  serigrafia: { A4: 8, A3: 12, 'A1/2': 5, Escudo: 4 },
  emborrachado: { A4: 16, A3: 24, 'A1/2': 10, Escudo: 8 }, // dobro da serigrafia
  bordado: { A4: 20, A3: 30, Escudo: 15 }, // exemplo, pode ajustar
};

// Tabela DTF
const tabelaDTF = {
  Escudo: [ { min: 1, max: 5, valor: 7 }, { min: 6, max: 19, valor: 5.5 }, { min: 20, max: 49, valor: 4 }, { min: 50, max: 9999, valor: 3 } ],
  A4: [ { min: 1, max: 5, valor: 20 }, { min: 6, max: 19, valor: 15 }, { min: 20, max: 49, valor: 12.5 }, { min: 50, max: 9999, valor: 10 } ],
  A3: [ { min: 1, max: 5, valor: 40 }, { min: 6, max: 19, valor: 30 }, { min: 20, max: 49, valor: 25 }, { min: 50, max: 9999, valor: 20 } ]
};

function getValorDTF(tamanho, qtd) {
  const tabela = tabelaDTF[tamanho];
  if (!tabela) return 0;
  const faixa = tabela.find(f => qtd >= f.min && qtd <= f.max);
  return faixa ? faixa.valor : 0;
}

const PersonalizationModal = ({ produto, onClose, onConfirm }) => {
  const [aplicacoes, setAplicacoes] = useState([
    { tipo: '', tamanho: '', local: '', qtd: 1 }
  ]);

  // Adicionar nova aplicação
  const addAplicacao = () => setAplicacoes([...aplicacoes, { tipo: '', tamanho: '', local: '', qtd: 1 }]);
  // Remover aplicação
  const removeAplicacao = idx => setAplicacoes(aplicacoes.filter((_, i) => i !== idx));
  // Atualizar aplicação
  const updateAplicacao = (idx, campo, valor) => {
    setAplicacoes(aplicacoes.map((a, i) => i === idx ? { ...a, [campo]: valor } : a));
  };

  // Calcular valor extra
  let valores = aplicacoes.map(apl => {
    if (!apl.tipo || !apl.tamanho) return 0;
    if (apl.tipo === 'dtf') {
      return getValorDTF(apl.tamanho, apl.qtd) * apl.qtd;
    }
    if (apl.tipo === 'emborrachado') {
      return (valoresBase['emborrachado'][apl.tamanho] || 0) * apl.qtd;
    }
    if (apl.tipo === 'bordado') {
      return (valoresBase['bordado'][apl.tamanho] || 0) * apl.qtd;
    }
    // Sublimação ou serigrafia
    return (valoresBase[apl.tipo][apl.tamanho] || 0) * apl.qtd;
  });
  // Desconto: só a aplicação de maior valor fica cheia, as outras 50%
  valores = valores.sort((a, b) => b - a);
  const valorExtra = valores.length > 1 ? valores[0] + valores.slice(1).reduce((acc, v) => acc + v * 0.5, 0) : (valores[0] || 0);

  const handleConfirm = () => {
    onConfirm(produto, aplicacoes, valorExtra);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Personalização de Camisa</h2>
        {aplicacoes.map((apl, idx) => (
          <div key={idx} className={styles.personalizacaoLinha}>
            <select value={apl.tipo} onChange={e => updateAplicacao(idx, 'tipo', e.target.value)}>
              <option value="">Tipo de aplicação</option>
              {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={apl.tamanho} onChange={e => updateAplicacao(idx, 'tamanho', e.target.value)}>
              <option value="">Tamanho</option>
              {tamanhos.filter(t => apl.tipo !== 'bordado' || t.value !== 'A1/2').map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={apl.local} onChange={e => updateAplicacao(idx, 'local', e.target.value)}>
              <option value="">Local</option>
              {locais.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <input type="number" min="1" value={apl.qtd} onChange={e => updateAplicacao(idx, 'qtd', Number(e.target.value))} style={{width: 60}} />
            {aplicacoes.length > 1 && <button onClick={() => removeAplicacao(idx)} style={{marginLeft: 8}}>Remover</button>}
          </div>
        ))}
        <button onClick={addAplicacao} style={{margin: '10px 0'}}>Adicionar Aplicação</button>
        <div style={{margin: '10px 0', fontWeight: 'bold'}}>Valor extra: R$ {valorExtra.toFixed(2)}</div>
        <div className={styles.modalActions}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationModal;
