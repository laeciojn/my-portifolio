// Conteúdo dos projetos. Para adicionar um projeto, acrescente um objeto aqui:
// a lista e a página de detalhe são geradas a partir destes dados.
export const PROJECTS = [
  {
    slug: 'organizador-estagio', name: 'Organizador de Estágio', status: 'Em uso',
    tags: ['HTML', 'JavaScript', 'Azure'],
    summary: 'Um app que fiz para organizar minha rotina de estágio num lugar só.',
    cols: [
      ['O que ele faz', ['Dashboard com visão geral', 'Aba Hoje com as tarefas do dia', 'Tarefas em kanban', 'Registro de reuniões', 'Notas']],
      ['Como funciona', ['Front em HTML e JavaScript', 'Hospedado como Azure Static Web App', 'API em Azure Functions', 'Dados gravados no Azure Blob Storage']],
      ['Próximo passo', ['Recriar em Power Pages com Dataverse, mantendo o visual e as funções']],
    ],
    stack: ['HTML', 'JavaScript', 'Azure Static Web Apps', 'Azure Functions', 'Blob Storage'],
  },
  {
    slug: 'pipefy-power-bi', name: 'Pipefy no Power BI', status: 'Em produção',
    tags: ['GraphQL', 'Make', 'Microsoft Graph'], viz: true,
    summary: 'Na Boa Safra, 9 relatórios do Pipefy eram exportados à mão para alimentar o Power BI. Automatizei o caminho inteiro.',
    cols: [
      ['O caminho', [
        'A API GraphQL do Pipefy gera o export de cada pipe (exportPipeReport)',
        'Um cenário no Make consulta o status do export (pipeReportExport) até o arquivo sair',
        'A Microsoft Graph API sobe cada Excel para a subpasta certa do SharePoint',
        'Os dashboards do Power BI leem direto do SharePoint',
      ]],
      ['Resultado', ['Cerca de 7,5 horas de trabalho manual a menos por mês', 'Dashboards sempre com a versão mais recente']],
    ],
    stack: ['Pipefy GraphQL', 'Make', 'Microsoft Graph', 'SharePoint', 'Power BI'],
  },
  {
    slug: 'taskflow-api', name: 'TaskFlow API', status: 'Em andamento',
    tags: ['Java', 'Spring Boot', 'PostgreSQL'],
    summary: 'API REST que uso para praticar o ecossistema Spring na prática.',
    cols: [
      ['O que pratiquei', ['Mapeamento de entidades com JPA (Autor e Livro)', 'Testes de repositório com JUnit', 'Valores monetários com BigDecimal e escala no Hibernate 6', 'Migrations com Flyway']],
      ['Ambiente', ['PostgreSQL e pgAdmin em containers', 'Docker Compose e rede própria entre os containers']],
    ],
    stack: ['Java', 'Spring Boot', 'JPA/Hibernate', 'PostgreSQL', 'Docker Compose', 'Flyway', 'JUnit'],
  },
  {
    slug: 'clone-pipefy', name: 'Clone do Pipefy', status: 'Em construção',
    tags: ['Java', 'Spring Boot'],
    summary: 'Um sistema de pipes, fases e cards em kanban, inspirado no Pipefy que usei no dia a dia.',
    cols: [['Escopo do MVP', ['Pipes com fases', 'Cards que andam entre as fases', 'Sem formulários e automações por enquanto, para focar no modelo de dados']]],
    stack: ['Java', 'Spring Boot'],
  },
  {
    slug: 'simulado-az900', name: 'Simulado AZ-900', status: 'Protótipo',
    tags: ['React'],
    summary: 'Plataforma de questões para estudar para a certificação Microsoft Azure Fundamentals.',
    cols: [['Funções', ['Simulado completo cronometrado de 45 minutos', 'Rodada rápida de 15 questões', 'Precisão por domínio da prova', 'Histórico de simulados e dicas do exame']]],
    stack: ['React'],
  },
  {
    slug: 'banco-ficticio', name: 'Banco fictício', status: 'Em construção',
    tags: ['Projeto pessoal'],
    summary: 'Uma aplicação de banco de mentira, com conta e programa de indicação.',
    cols: [['Regra de indicação', ['Cada conta tem um link de indicação', 'Quem se cadastra pelo link ganha R$ 100 de bônus na conta']]],
    stack: [],
  },
  {
    slug: 'primeiro-portfolio', name: 'Primeiro portfólio', status: 'Onde começou',
    tags: ['HTML', 'CSS'],
    summary: 'Meu primeiro site, feito durante os cursos de HTML e CSS da Alura.',
    cols: [], stack: ['HTML', 'CSS'],
    link: 'https://github.com/laeciojn/portifolio',
  },
];
