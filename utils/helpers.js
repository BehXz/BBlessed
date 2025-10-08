function parseCurrencyToCents(value) {
  return Math.round(Number(String(value).replace(/[^\d,-]/g, '').replace(',', '.')) * 100);
}

function formatCentsToBRL(cents) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

module.exports = { parseCurrencyToCents, formatCentsToBRL };
