// Sincronização automática de repositórios públicos via API do GitHub.
// Toda vez que um novo repositório é criado ou atualizado no GitHub,
// ele aparece automaticamente no portfólio sem precisar alterar código.
import { hasGsap } from '../core/env.js';

const GITHUB_USERNAME = 'laeciojn';
const CACHE_KEY = 'laecio_repos_cache_v2';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos de cache para carregamento imediato sem atingir rate limit

// Descrições e resumos complementares para repositórios conhecidos caso não estejam preenchidos no GitHub
const KNOWN_DESCRIPTIONS = {
  'cadastro-usuario': 'CRUD de cadastro de usuário com Spring Boot, H2, JPA e Lombok.',
  'library-api': 'API REST para biblioteca: cadastro, empréstimo e consulta.',
  'banco-digital': 'Simulação de banco digital: contas, transações e regras de negócio.',
  'bookstore-spring-jpa': 'API de livraria com Spring e JPA, com foco em relacionamentos.',
  'produtos-api': 'API REST de catálogo de produtos, organizada em camadas.',
  'arquitetura-spring': 'Padrões de arquitetura em aplicações Spring.',
  'api-usuarios': 'API de usuários em Java, praticando autenticação e camadas de serviço.',
  'estudo-python': 'Repositório de práticas em Python, Django e Pandas.',
  'logistica-dashboard-powerbi': 'Dashboard de indicadores de logística em Power BI.',
  'devops-cicd': 'Primeiros pipelines de integração e entrega contínua com GitHub Actions.',
  'pinterest-clone': 'Clone de interface em HTML, CSS e JavaScript.',
  'daily-diet-api': 'API de controle de refeições e métricas de dieta.',
  'sample-flask-auth': 'Autenticação e controle de sessões com Python e Flask.',
  'magic-react': 'Interface interativa desenvolvida com React e componentes modernos.',
  'agenda-de-contatos': 'Aplicação para gerenciamento de contatos com Python.',
  'rest-with-spring-boot-and-java': 'API RESTful completa em Java com Spring Boot.',
  'collections-java': 'Estudos aprofundados sobre Collections e estruturas de dados em Java.',
  'spring-boot-basico': 'Fundamentos e primeiros passos com o ecossistema Spring Boot.',
  'automacao-python': 'Scripts e automações de processos e tarefas repetitivas em Python.',
  'estrutura-de-dados-java': 'Implementação de estruturas de dados e algoritmos em Java.',
  'CalculadoraIMC': 'Calculadora de índice de massa corporal (IMC) em Java.',
  'challenge-amigo-secreto': 'Aplicação do desafio de sorteio de amigo secreto.',
  'site': 'Página temática desenvolvida com HTML5 e CSS3 moderno.',
  'Java---Alura': 'Mini-game e exercícios práticos em Java com foco em fundamentos da linguagem.',
};

function formatDescription(repo) {
  if (repo.description && repo.description.trim()) {
    return repo.description.trim();
  }
  if (KNOWN_DESCRIPTIONS[repo.name]) {
    return KNOWN_DESCRIPTIONS[repo.name];
  }
  if (repo.language) {
    return `Projeto desenvolvido em ${repo.language}, disponível com código aberto.`;
  }
  return 'Código aberto e documentação disponíveis no GitHub.';
}

function renderRepos(repos) {
  const container = document.querySelector('.repos__list');
  if (!container || !Array.isArray(repos)) return;

  // Filtra forks e repositórios especiais de perfil/portfólio
  const validRepos = repos.filter((r) => {
    const name = (r.name || '').toLowerCase();
    return !r.fork && name !== 'laeciojn' && name !== 'my-portifolio';
  });

  if (!validRepos.length) return;

  container.innerHTML = validRepos.map((repo) => {
    const desc = formatDescription(repo);
    return `
      <li>
        <div class="repo-card__top">
          <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name} ↗</a>
          <div class="repo-card__meta">
            ${repo.language ? `<span class="repo-card__badge"><span class="repo-card__dot"></span>${repo.language}</span>` : ''}
            ${repo.stargazers_count > 0 ? `<span class="repo-card__stars">★ ${repo.stargazers_count}</span>` : ''}
          </div>
        </div>
        <span class="repo-desc">${desc}</span>
      </li>
    `;
  }).join('');

  if (hasGsap && window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
  }
}

export async function initRepos() {
  const container = document.querySelector('.repos__list');
  if (!container) return;

  let hasCachedData = false;

  // 1. Renderiza imediatamente do cache se existir
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Array.isArray(data) && data.length) {
        renderRepos(data);
        hasCachedData = true;
        // Se estiver dentro do TTL, não precisa buscar novamente nesta sessão
        if (Date.now() - timestamp < CACHE_TTL) {
          return;
        }
      }
    }
  } catch (e) {
    console.warn('Erro ao ler cache de repositórios:', e);
  }

  // 2. Busca dados em tempo real da API do GitHub
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=30`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const repos = await res.json();
    if (Array.isArray(repos) && repos.length) {
      renderRepos(repos);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: repos, timestamp: Date.now() }));
      } catch (storageError) {
        /* localStorage desabilitado ou sem espaço */
      }
    }
  } catch (err) {
    if (!hasCachedData) {
      console.warn('Usando lista estática inicial de repositórios:', err);
    }
  }
}
