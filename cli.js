#!/usr/bin/env node

const { program } = require('commander');
const GitHubTrends = require('./index');
const { validateDates, formatDate } = require('./utils/dateParser');

program
  .name('github-trends')
  .description('CLI para encontrar projetos populares do GitHub por intervalo de datas')
  .version('1.0.0');

program
  .option('-f, --from-date <date>', 'Data de início (YYYY-MM-DD) - padrão: 30 dias atrás')
  .option('-t, --to-date <date>', 'Data de fim (YYYY-MM-DD) - padrão: hoje')
  .option('-l, --limit <number>', 'Número máximo de resultados (padrão: 10)', '10')
  .option('-o, --output <file>', 'Arquivo para salvar os resultados (CSV ou JSON)')
  .option('-m, --min-stars <number>', 'Número mínimo de estrelas (padrão: 100)', '100')
  .option('-v, --verbose', 'Modo verboso', false);

program.addHelpText('after', `
Exemplos:
  # Projetos populares dos últimos 30 dias
  github-trends
  
  # Projetos populares entre datas específicas
  github-trends --from-date 2024-01-01 --to-date 2024-01-31
  
  # Salvar resultados em CSV
  github-trends --from-date 2024-01-01 --to-date 2024-01-31 --output results.csv
  
  # Limitar número de resultados
  github-trends --limit 20 --output top_projects.csv
  
  # Mínimo de 500 estrelas
  github-trends --min-stars 500 --verbose
`);

async function main() {
  program.parse();
  
  const options = program.opts();
  
  try {
    // Validar e processar datas
    const { fromDate, toDate } = validateDates(options.fromDate, options.toDate);
    
    // Validar outros parâmetros
    const limit = parseInt(options.limit);
    const minStars = parseInt(options.minStars);
    
    if (isNaN(limit) || limit <= 0) {
      console.error('Erro: O limite deve ser um número positivo');
      process.exit(1);
    }
    
    if (isNaN(minStars) || minStars < 0) {
      console.error('Erro: O número mínimo de estrelas deve ser um número não negativo');
      process.exit(1);
    }
    
    if (options.verbose) {
      console.log(`Buscando projetos criados entre ${formatDate(fromDate)} e ${formatDate(toDate)}`);
      console.log(`Mínimo de estrelas: ${minStars}, Limite: ${limit}`);
    }
    
    // Criar instância e buscar projetos
    const githubTrends = new GitHubTrends();
    const projects = await githubTrends.searchProjects(fromDate, toDate, minStars, limit);
    
    // Exibir resultados
    githubTrends.displayResults(projects);
    
    // Salvar em arquivo se especificado
    if (options.output) {
      await githubTrends.saveResults(projects, options.output);
      console.log(`\nResultados salvos em: ${options.output}`);
    }
    
  } catch (error) {
    console.error('Erro:', error.message);
    if (options.verbose) {
      console.error('Detalhes:', error);
    }
    process.exit(1);
  }
}

main();