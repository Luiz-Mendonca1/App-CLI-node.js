const axios = require('axios');
const { writeFile, readFile } = require('fs/promises');
const { formatDate } = require('./utils/dateParser');
const { saveAsCSV } = require('./utils/fileHandler');

class GitHubTrends {
  constructor() {
    this.baseURL = 'https://api.github.com/search/repositories';
    this.client = axios.create({
      headers: {
        'User-Agent': 'GitHub-Trends-CLI/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
  }

  /**
   * Faz solicitação HTTP para API do GitHub e analisa JSON
   */
  async searchProjects(fromDate, toDate, minStars, limit) {
    try {
      const query = `created:${formatDate(fromDate)}..${formatDate(toDate)} stars:>=${minStars}`;
      
      const response = await this.client.get(this.baseURL, {
        params: {
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: Math.min(limit, 100)
        }
      });

      if (response.status !== 200) {
        throw new Error(`Erro na API GitHub: ${response.status} - ${response.statusText}`);
      }

      const data = response.data;
      
      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Resposta da API em formato inválido');
      }

      // Processar e formatar os resultados
      return data.items.slice(0, limit).map(item => ({
        name: item.name,
        full_name: item.full_name,
        html_url: item.html_url,
        description: item.description || 'Sem descrição',
        stars: item.stargazers_count,
        forks: item.forks_count,
        language: item.language || 'Não especificada',
        created_at: item.created_at,
        updated_at: item.updated_at,
        owner: item.owner.login
      }));

    } catch (error) {
      if (error.response) {
        // Erro da API GitHub
        if (error.response.status === 403) {
          throw new Error('Limite de taxa excedido. Tente novamente mais tarde.');
        } else if (error.response.status === 422) {
          throw new Error('Parâmetros de busca inválidos.');
        } else {
          throw new Error(`Erro GitHub API: ${error.response.status} - ${error.response.data.message}`);
        }
      }
      throw error;
    }
  }

  /**
   * Exibe resultados no console
   */
  displayResults(projects) {
    if (projects.length === 0) {
      console.log('Nenhum projeto encontrado com os critérios especificados.');
      return;
    }

    console.log('\n📊 PROJETOS POPULARES DO GITHUB');
    console.log('=' .repeat(80));
    
    projects.forEach((project, index) => {
      console.log(`\n${index + 1}. ${project.full_name}`);
      console.log(`   ⭐ Estrelas: ${project.stars} | 🍴 Forks: ${project.forks} | 💻 Linguagem: ${project.language}`);
      console.log(`   📝 ${project.description}`);
      console.log(`   🔗 ${project.html_url}`);
      console.log(`   📅 Criado em: ${new Date(project.created_at).toLocaleDateString('pt-BR')}`);
    });
    
    console.log(`\nTotal de projetos encontrados: ${projects.length}`);
  }

  /**
   * Salva resultados em arquivo (CSV ou JSON)
   */
  async saveResults(projects, filename) {
    try {
      if (filename.endsWith('.csv')) {
        await saveAsCSV(projects, filename);
      } else if (filename.endsWith('.json')) {
        await writeFile(filename, JSON.stringify(projects, null, 2), 'utf8');
      } else {
        throw new Error('Formato de arquivo não suportado. Use .csv ou .json');
      }
    } catch (error) {
      throw new Error(`Erro ao salvar arquivo: ${error.message}`);
    }
  }

  /**
   * Lê e analisa arquivo CSV de terceiros
   */
  async parseCSVFile(filepath) {
    try {
      const { parseCSV } = require('./utils/csvParser');
      return await parseCSV(filepath);
    } catch (error) {
      throw new Error(`Erro ao analisar arquivo CSV: ${error.message}`);
    }
  }
}

module.exports = GitHubTrends;