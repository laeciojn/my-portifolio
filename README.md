# Portfólio | Laécio Neves

Site estático (HTML, CSS e JavaScript puro) com animações em GSAP.

## Estrutura

```
index.html              marcação das seções
css/
  main.css              importa todos os outros na ordem certa
  tokens.css            cores, fonte e espaçamentos (tema)
  base.css              reset, tipografia, botões e utilitários
  sections/             um arquivo por seção da página
js/
  main.js               ponto de entrada: inicia cada funcionalidade
  core/env.js           flags de ambiente e registro dos plugins do GSAP
  core/scroll.js        rolagem suave e navegação por âncoras
  data/projects.js      conteúdo dos projetos (edite aqui)
  features/             uma funcionalidade por arquivo
```

## Rodar no computador

Os arquivos em `js/` são módulos ES (`import`/`export`). O navegador bloqueia módulos
abertos direto do disco (`file://`), então é preciso um servidor local:

- VS Code: extensão **Live Server** → botão "Go Live"
- ou no terminal: `npx serve .` ou `python -m http.server 8000`

## Deploy

GitHub Pages, publicado a partir da raiz da branch `main` do repositório
[`laeciojn/my-portfolio`](https://github.com/laeciojn/my-portfolio).
Site no ar: https://laeciojn.github.io/my-portfolio/
