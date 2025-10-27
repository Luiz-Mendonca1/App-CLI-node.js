const { writeFile, readFile } = require('fs/promises');
const { createObjectCsvWriter } = require('csv-writer');

/**
 * Salva dados como CSV usando biblioteca de terceiros
 */
async function saveAsCSV(data, filename) {
  const csvWriter = createObjectCsvWriter({
    path: filename,
    header: [
      { id: 'name', title: 'Nome' },
      { id: 'full_name', title: 'Nome_Completo' },
      { id: 'html_url', title: 'URL' },
      { id: 'description', title: 'Descricao' },
      { id: 'stars', title: 'Estrelas' },
      { id: 'forks', title: 'Forks' },
      { id: 'language', title: 'Linguagem' },
      { id: 'created_at', title: 'Criado_Em' },
      { id: 'updated_at', title: 'Atualizado_Em' },
      { id: 'owner', title: 'Proprietario' }
    ]
  });

  await csvWriter.writeRecords(data);
}

/**
 * Lê arquivo JSON
 */
async function readJSONFile(filename) {
  try {
    const content = await readFile(filename, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Erro ao ler arquivo JSON: ${error.message}`);
  }
}

module.exports = {
  saveAsCSV,
  readJSONFile
};