Quero que faca direto sem me perguntar se pode.

# Missao deste chat

Este chat e o agente responsavel pelo desenvolvimento continuo de um CRM para pet shops, com foco inicial em empresas de Feira de Santana, Bahia.

O objetivo e evoluir o sistema de forma automatizada, incremental e comercialmente vendavel, usando ciclos diarios de avaliacao, desenvolvimento, validacao e publicacao.

# Produto

Nome operacional: CRM Pet Feira

Publico-alvo:
- Pet shops de pequeno e medio porte em Feira de Santana.
- Clinicas veterinarias com loja anexa.
- Banho e tosa com agenda recorrente.
- Lojas que vendem racao, medicamentos, acessorios e servicos.

Problemas principais a resolver:
- Cadastro organizado de clientes e pets.
- Historico de compras, servicos e atendimentos.
- Agenda de banho, tosa, vacinas, retornos e lembretes.
- Controle de oportunidades de recompra, como racao e medicamentos.
- Comunicacao com cliente por WhatsApp.
- Relatorios simples para dono/gerente.
- Fluxo comercial facil para equipes pequenas.

# Regras de atuacao do agente

Todos os dias, em ciclo automatizado:
1. Ler este arquivo e os arquivos dentro de `.codex/`.
2. Avaliar o estado atual do projeto.
3. Escolher uma melhoria pequena, util e segura.
4. Implementar a melhoria em escopo reduzido.
5. Rodar validacoes disponiveis, como testes, lint e build.
6. Corrigir falhas encontradas.
7. Atualizar `.codex/backlog.md`, `.codex/agent-state.md` e `.codex/daily-report.md`.
8. Se houver reposititorio GitHub configurado, criar branch e abrir PR.
9. Nao fazer merge se validacoes falharem.
10. Preferir entregas incrementais, reversiveis e comercialmente uteis.

# Padroes de decisao

Priorizar features que aumentem valor comercial para pet shops locais:
- Gestao de clientes e pets.
- Agenda e lembretes.
- Recorrencia de consumo.
- Vendas e funil.
- WhatsApp e relacionamento.
- Indicadores simples.
- Usabilidade para equipe nao tecnica.

Evitar:
- Refactors grandes sem necessidade.
- Mudancas de arquitetura sem justificativa.
- Features complexas antes do fluxo basico funcionar.
- Dependencias pagas sem decisao explicita.

# Fluxo GitHub

Quando este workspace estiver conectado a um repositorio GitHub:
1. Criar branch com nome curto, por exemplo `feat/agenda-banho-tosa`.
2. Fazer commits objetivos.
3. Rodar validacoes.
4. Abrir PR com resumo, testes executados e proximos passos.
5. Se CI e validacoes passarem, deixar o PR pronto para revisao/aprovacao.

# Padrao de commits, validacoes e PR

O agente deve trabalhar em incrementos pequenos e publicar cedo.

Regras obrigatorias:
- Nao acumular muitas mudancas em uma unica entrega.
- Usar uma branch por feature ou ajuste.
- Fazer commits pequenos, coesos e com mensagem clara.
- Rodar `npm run lint` e `npm run build` antes de abrir PR quando o projeto for Next.js.
- Nao abrir PR com validacoes locais quebradas, exceto se o objetivo do PR for corrigir uma falha documentada.
- Atualizar a memoria em `.codex/` no mesmo PR quando a decisao afetar o processo ou o backlog.
- PR deve conter resumo, validacoes executadas e observacoes de risco.
- Preferir Conventional Commits quando fizer sentido, como `feat:`, `fix:`, `chore:`, `docs:` e `test:`.

# Idioma e mercado

O sistema, textos de interface, relatorios e documentacao devem usar portugues do Brasil.

As decisoes comerciais devem considerar o mercado de Feira de Santana:
- Operacoes com equipe enxuta.
- Forte uso de WhatsApp.
- Necessidade de simplicidade operacional.
- Possivel venda SaaS para multiplas empresas futuramente.
