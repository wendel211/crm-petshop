# Estado do Agente

## Sistema

CRM Pet Feira

## Responsabilidade deste chat

Conduzir o desenvolvimento continuo deste sistema com ciclos diarios automatizados:
- Planejar a proxima melhoria.
- Implementar.
- Validar.
- Preparar PR quando houver GitHub configurado.
- Atualizar memoria operacional.

## Estado atual

Workspace inicial configurado com memoria do agente, backlog de produto e repositorio GitHub conectado.

Ultimo ciclo executado em 2026-06-07:
- Adicionada central inicial de lembretes WhatsApp na tela operacional.
- Adicionadas mensagens prontas com links `wa.me` para confirmacao de agenda e retorno.
- Data do painel passou a ser dinamica para a operacao do dia.
- Build ajustado para ambiente Windows/Codex: fontes locais, `typecheck` explicito e workers do Next via threads com `cpus: 1`.

Ultimo ciclo executado em 2026-06-08:
- Botao `Novo cliente` evoluido para formulario funcional de tutor e pet.
- Cadastro salvo em `localStorage` com leitura estavel via `useSyncExternalStore`.
- Tabela de clientes virou lista em cards no mobile para remover overflow horizontal.
- Persistencia local validada em recarga e verificacao visual desktop/mobile sem erros novos de console.

Ainda pendente:
- Evoluir a primeira versao funcional com agenda real.
- Adicionar persistencia de dados com PostgreSQL e Prisma.
- Configurar testes automatizados alem de lint/build.

## Preferencia atual de ciclo

Executar diariamente as 09:00 no horario de Brasilia.

## Proxima acao recomendada

Preparar schema Prisma/PostgreSQL e trocar o cadastro local por persistencia real multiempresa.

## Preferencia de publicacao

- Criar PR automaticamente nas proximas entregas quando as validacoes locais passarem.
- Se o conector GitHub retornar erro, tentar a API do GitHub com a credencial local do Git Credential Manager.
- Aplicar labels `codex` e `codex-automation` quando disponiveis.
- Tentar aprovar automaticamente o PR apos validacoes, mas registrar bloqueio quando o GitHub impedir aprovacao do proprio PR.

## Decisoes em aberto

- Nome comercial final.
- Politica de merge automatico.
- Integracao real com WhatsApp ou apenas links/atalhos no MVP.
