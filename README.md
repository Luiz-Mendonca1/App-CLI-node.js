Projeto de estudo node.js

Uma ferramenta de linha de comando (CLI) para descobrir os repositórios mais populares do GitHub em qualquer intervalo de datas. Perfeito para desenvolvedores, pesquisadores e entusiastas de open source que querem acompanhar as tendências do GitHub.

✨ Características
🔍 Busca inteligente - Encontre repositórios por intervalo de datas

⭐ Ordenação por popularidade - Classifique por número de estrelas

💾 Múltiplos formatos - Exporte para CSV ou JSON

📊 Resultados detalhados - Estrelas, forks, linguagem, descrição e mais

🎯 Filtros avançados - Mínimo de estrelas, limite de resultados

🔧 Fácil de usar - Interface de linha de comando intuitiva

📦 Instalação
Método 1: NPX (Recomendado)
npx github-trends-cli --from-date 2024-01-01 --limit 10

Método 2: Instalação Global
npm install -g github-trends-cli
github-trends --help

Método 3: Clone o Repositório
git clone https://github.com/seu-usuario/github-trends-cli.git
cd github-trends-cli
npm install
npm link  # Instala globalmente a partir do código fonte

🚀 Uso Rápido
Buscar projetos dos últimos 30 dias:
github-trends

Buscar projetos entre datas específicas:
github-trends --from-date 2024-01-01 --to-date 2024-01-31

Salvar resultados em CSV:
github-trends --output resultados.csv --limit 15

Buscar projetos com no mínimo 500 estrelas:
github-trends --min-stars 500 --verbose

Buscar os 20 projetos mais populares:
github-trends --limit 20 --output top-projects.json
