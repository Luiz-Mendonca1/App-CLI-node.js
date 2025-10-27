const fs = require('fs');
const csv = require('csv-parser');

/**
 * Analisa arquivo CSV usando biblioteca de terceiros
 */
function parseCSV(filepath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filepath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

module.exports = {
  parseCSV
};