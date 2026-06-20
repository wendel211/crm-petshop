# Estrutura do Sistema

## Produto

CRM Pet Feira e um SaaS vertical para pet shops, banho e tosa, clinicas veterinarias pequenas e lojas pet que precisam organizar clientes, pets, agenda, recompra e relacionamento por WhatsApp.

## Stack atual

- Next.js com App Router.
- TypeScript.
- Tailwind CSS.
- ESLint.
- Prisma 7.

## Banco de dados

- Banco oficial: PostgreSQL.
- ORM/migrations: Prisma.
- Provedor recomendado para MVP: Neon Postgres ou Supabase Postgres.
- Modelo SaaS: usar `companyId` nas entidades de negocio para permitir multiempresa.
- Configuracao: `prisma.config.ts` le `DATABASE_URL`; `.env.example` documenta a conexao local.
- Migration inicial: `prisma/migrations/20260620100600_initial_schema/migration.sql`.
- Lock de migrations: `prisma/migrations/migration_lock.toml` com provider PostgreSQL.

## Entidades principais

- Company: empresa assinante.
- User: usuario do sistema.
- Customer: tutor/cliente.
- Pet: animal vinculado ao tutor.
- Service: servico prestado.
- Appointment: agenda de banho, tosa, consulta, vacina e retorno.
- Product: produto relevante para venda/recompra.
- Sale: venda registrada.
- Interaction: contato, atendimento e observacoes.
- Reminder: lembrete operacional e comercial.

## Roadmap tecnico sugerido

1. Evoluir formularios de cliente, pet e agenda.
2. Acompanhar merge do seed demonstrativo.
3. Conectar formularios ao banco.
4. Implementar listagens reais.
5. Criar lembretes baseados em dados reais.
6. Adicionar autenticacao.
7. Preparar permissoes por perfil.

## Criterios de uma boa feature diaria

- Cabe em um PR pequeno.
- Roda lint e build.
- Melhora uma jornada real do pet shop.
- Atualiza backlog/estado quando muda arquitetura ou prioridade.
- Nao depende de servico pago sem decisao registrada.
