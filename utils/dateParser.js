const { format, subDays, parseISO, isValid } = require('date-fns');

/**
 * Valida e formata datas
 */
function validateDates(fromDateStr, toDateStr) {
  let fromDate, toDate;

  // Processar data de início
  if (fromDateStr) {
    fromDate = parseISO(fromDateStr);
    if (!isValid(fromDate)) {
      throw new Error('Data de início inválida. Use o formato YYYY-MM-DD');
    }
  } else {
    fromDate = subDays(new Date(), 30);
  }

  // Processar data de fim
  if (toDateStr) {
    toDate = parseISO(toDateStr);
    if (!isValid(toDate)) {
      throw new Error('Data de fim inválida. Use o formato YYYY-MM-DD');
    }
  } else {
    toDate = new Date();
  }

  // Validar intervalo
  if (fromDate > toDate) {
    throw new Error('A data de início não pode ser posterior à data de fim');
  }

  return { fromDate, toDate };
}

/**
 * Formata data para YYYY-MM-DD
 */
function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

module.exports = {
  validateDates,
  formatDate
};