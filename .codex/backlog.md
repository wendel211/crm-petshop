# Backlog do CRM Pet Feira

## Entregue

- Painel operacional inicial com agenda, clientes e oportunidades.
- Central inicial de lembretes WhatsApp com mensagens prontas para confirmacao de agenda e recuperacao de retorno.
- Cadastro local de clientes e pets com formulario funcional, persistencia no navegador e listagem responsiva.
- Agendamento local de servicos com formulario funcional, persistencia no navegador e atalho de confirmacao por WhatsApp.
- Schema inicial Prisma/PostgreSQL com entidades multiempresa para clientes, pets, agenda, vendas, interacoes e lembretes.

## Agora

- Evoluir o cadastro local para persistencia real em PostgreSQL/Prisma.
- Evoluir o agendamento local para persistencia real em PostgreSQL/Prisma.
- Criar migration inicial e seed demonstrativo para uma empresa de Feira de Santana.
- Criar agenda de banho, tosa, consulta e vacina.
- Criar historico de interacoes com cliente.

## Arquitetura de dados

- Banco oficial: PostgreSQL.
- ORM/migrations: Prisma.
- Provedores recomendados para MVP: Neon Postgres ou Supabase Postgres.
- Padrao SaaS: todas as entidades de negocio devem carregar `companyId` para multiempresa.
- Evitar SQLite/Firebase como base principal, porque o produto tem relacoes fortes entre cliente, pet, agenda, venda, recompra e lembretes.

### Entidades iniciais PostgreSQL

- companies: empresa contratante do sistema.
- users: usuarios vinculados a uma empresa.
- customers: tutores/clientes.
- pets: animais vinculados ao tutor.
- services: servicos como banho, tosa, consulta e vacina.
- appointments: agendamentos.
- products: produtos relevantes para recompra.
- sales: vendas e compras historicas.
- interactions: historico de contato e atendimento.
- reminders: lembretes de retorno, vacina, recompra e campanhas.

### Base Prisma criada

- `prisma/schema.prisma` define o schema inicial com `companyId` nas entidades de negocio.
- `prisma.config.ts` carrega `DATABASE_URL` via `.env`.
- Scripts disponiveis: `npm run db:validate`, `npm run db:generate` e `npm run db:migrate`.
- `.env.example` documenta uma URL PostgreSQL local para desenvolvimento.

## Proximas features comerciais

- Transformar lembretes WhatsApp mockados em fluxo com dados reais.
- Transformar o cadastro local em base compartilhada por empresa.
- Transformar a agenda local em base compartilhada por empresa.
- Controle de recompra de racao.
- Aniversario do pet e campanhas.
- Etiquetas de clientes: VIP, recorrente, em risco, novo.
- Funil de oportunidades.
- Relatorio diario de agenda e vendas.
- Dashboard simples para dono/gerente.
- Multiempresa para vender como SaaS.
- Permissoes por perfil: dono, gerente, atendente.

## Hipoteses de produto

- Pet shops locais valorizam mais simplicidade e WhatsApp do que automacoes complexas.
- O primeiro MVP deve reduzir perda de retornos e melhorar organizacao da agenda.
- O diferencial comercial pode ser "CRM que lembra quando o cliente precisa voltar".

## Ideias futuras

- Integracao com WhatsApp Business API.
- Importacao de clientes via planilha.
- Controle basico de estoque.
- Programa de fidelidade.
- Area do tutor para consultar historico do pet.
- Notificacoes automaticas antes de vacinas e banho/tosa.
- Relatorios por bairro de Feira de Santana.
