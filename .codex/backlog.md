# Backlog do CRM Pet Feira

## Entregue

- Painel operacional inicial com agenda, clientes e oportunidades.
- Central inicial de lembretes WhatsApp com mensagens prontas para confirmacao de agenda e recuperacao de retorno.

## Agora

- Criar formularios funcionais para clientes, pets e agenda.
- Implementar persistencia inicial com PostgreSQL e Prisma.
- Modelar entidades principais: empresa, usuario, cliente, pet, atendimento, agendamento, produto e venda.
- Criar cadastro de clientes.
- Criar cadastro de pets vinculado ao cliente.
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

## Proximas features comerciais

- Transformar lembretes WhatsApp mockados em fluxo com dados reais.
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
