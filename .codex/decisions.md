# Decisoes do Produto e Engenharia

## 2026-06-07

- Este chat sera responsavel pelo sistema CRM Pet Feira.
- O produto sera focado inicialmente em pet shops e negocios pet de Feira de Santana.
- A evolucao sera feita em ciclos diarios automatizados.
- O agente deve priorizar features pequenas, validaveis e uteis para venda futura.
- A memoria operacional ficara no repositorio em arquivos dentro de `.codex/`.
- O repositorio GitHub base e `https://github.com/wendel211/crm-petshop.git`.
- O fluxo deve usar branches pequenas, validacoes antes de PR e commits coesos.
- O agente nao deve acumular muitas mudancas antes de subir.
- A stack inicial sera Next.js, TypeScript, Tailwind CSS e ESLint.
- A primeira entrega do produto sera uma superficie operacional, nao uma landing page.
- O banco de dados oficial do produto sera PostgreSQL.
- A camada de modelagem e migrations recomendada sera Prisma.
- A arquitetura deve nascer multiempresa usando `companyId` nas entidades de negocio.
- Para MVP, priorizar Neon Postgres ou Supabase Postgres como provedor gerenciado.

## Decisoes pendentes

- Estrategia de autenticacao.
- Estrategia de deploy.
