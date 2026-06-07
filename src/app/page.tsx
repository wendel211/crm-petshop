export const dynamic = "force-dynamic";

const metrics = [
  { label: "Agendamentos hoje", value: "18", detail: "6 banho e tosa em aberto" },
  { label: "Clientes ativos", value: "342", detail: "28 novos nos ultimos 30 dias" },
  { label: "Retornos previstos", value: "41", detail: "Racao, vacina e revisao" },
  { label: "Oportunidades", value: "R$ 4,8 mil", detail: "Recompras mapeadas" },
];

const appointments = [
  {
    time: "08:30",
    pet: "Luna",
    service: "Banho e tosa",
    tutor: "Mariana Alves",
    status: "Confirmado",
  },
  {
    time: "10:00",
    pet: "Thor",
    service: "Vacina V10",
    tutor: "Joao Pereira",
    status: "Lembrar",
  },
  {
    time: "14:20",
    pet: "Mel",
    service: "Retorno clinico",
    tutor: "Carla Souza",
    status: "Pendente",
  },
  {
    time: "16:00",
    pet: "Bob",
    service: "Tosa higienica",
    tutor: "Rafael Lima",
    status: "Confirmado",
  },
];

const customers = [
  { name: "Mariana Alves", pet: "Luna", phone: "(75) 99124-8821", tag: "VIP" },
  { name: "Joao Pereira", pet: "Thor", phone: "(75) 98802-1193", tag: "Vacina" },
  { name: "Carla Souza", pet: "Mel", phone: "(75) 99744-3308", tag: "Retorno" },
  { name: "Rafael Lima", pet: "Bob", phone: "(75) 98116-7520", tag: "Tosa" },
];

const opportunities = [
  "Enviar lembrete de recompra de racao para 12 tutores",
  "Confirmar 3 vacinas pendentes para esta semana",
  "Reativar 8 clientes sem visita ha mais de 60 dias",
];

const reminders = [
  {
    tutor: "Mariana Alves",
    pet: "Luna",
    reason: "Banho e tosa confirmado para hoje as 08:30",
    due: "Hoje, 07:45",
    phone: "(75) 99124-8821",
    priority: "Hoje",
    message:
      "Oi, Mariana! A Luna esta confirmada para banho e tosa hoje as 08:30. Se precisar ajustar o horario, responde aqui.",
  },
  {
    tutor: "Joao Pereira",
    pet: "Thor",
    reason: "Vacina V10 agendada para hoje as 10:00",
    due: "Hoje, 09:15",
    phone: "(75) 98802-1193",
    priority: "Confirmar",
    message:
      "Oi, Joao! Passando para confirmar a vacina V10 do Thor hoje as 10:00. Posso manter esse horario?",
  },
  {
    tutor: "Carla Souza",
    pet: "Mel",
    reason: "Retorno clinico pendente desde ontem",
    due: "Atrasado",
    phone: "(75) 99744-3308",
    priority: "Atrasado",
    message:
      "Oi, Carla! A Mel ficou com retorno clinico pendente. Quer que eu reserve um novo horario para voce ainda esta semana?",
  },
];

function formatWhatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("55")) {
    return digits;
  }

  return `55${digits}`;
}

function buildWhatsappLink(phone: string, message: string) {
  const target = formatWhatsappNumber(phone);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${target}?text=${encodedMessage}`;
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Confirmado"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "Lembrar"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <span className={`rounded-md border px-2 py-1 text-xs font-medium ${tone}`}>
      {status}
    </span>
  );
}

export default function Home() {
  const todayLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#1f2520]">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-[#ded8ca] bg-[#20251f] px-5 py-6 text-white lg:border-b-0 lg:border-r">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#b8c7b0]">
              CRM Pet Feira
            </p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight">
              Operacao diaria
            </h1>
          </div>

          <nav className="mt-10 grid gap-2 text-sm text-[#d8dfd2]">
            {["Painel", "Clientes", "Pets", "Agenda", "Oportunidades"].map(
              (item) => (
                <a
                  key={item}
                  className="rounded-md px-3 py-2 transition hover:bg-white/10"
                  href="#"
                >
                  {item}
                </a>
              ),
            )}
          </nav>

          <div className="mt-10 border-t border-white/10 pt-6 text-sm text-[#b8c7b0]">
            <p className="font-medium text-white">Feira de Santana</p>
            <p className="mt-2 leading-6">
              Fluxo inicial para lojas com agenda, recompra e atendimento por
              WhatsApp.
            </p>
          </div>
        </aside>

        <section className="px-5 py-6 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-4 border-b border-[#ded8ca] pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#60725a]">{todayLabel}</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal">
                Visao do pet shop
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-md border border-[#c7c0b2] px-4 py-2 text-sm font-medium transition hover:bg-white">
                Novo cliente
              </button>
              <button className="rounded-md bg-[#2f6f5e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#285f51]">
                Agendar servico
              </button>
            </div>
          </header>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-[#ded8ca] bg-white p-4"
              >
                <p className="text-sm text-[#60725a]">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold">{metric.value}</p>
                <p className="mt-2 text-sm text-[#6e746a]">{metric.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
            <section className="rounded-lg border border-[#ded8ca] bg-white">
              <div className="flex items-center justify-between border-b border-[#ebe6dc] px-4 py-4">
                <h3 className="text-base font-semibold">Agenda de hoje</h3>
                <span className="text-sm text-[#60725a]">18 servicos</span>
              </div>
              <div className="divide-y divide-[#ebe6dc]">
                {appointments.map((appointment) => (
                  <div
                    key={`${appointment.time}-${appointment.pet}`}
                    className="grid gap-3 px-4 py-4 md:grid-cols-[72px_1fr_auto]"
                  >
                    <span className="font-mono text-sm text-[#60725a]">
                      {appointment.time}
                    </span>
                    <div>
                      <p className="font-medium">
                        {appointment.pet} - {appointment.service}
                      </p>
                      <p className="mt-1 text-sm text-[#6e746a]">
                        Tutor: {appointment.tutor}
                      </p>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#ded8ca] bg-white">
              <div className="border-b border-[#ebe6dc] px-4 py-4">
                <h3 className="text-base font-semibold">Oportunidades</h3>
                <p className="mt-1 text-sm text-[#60725a]">
                  Acoes rapidas para relacionamento e recompra.
                </p>
              </div>
              <div className="grid gap-3 p-4">
                {opportunities.map((item) => (
                  <button
                    key={item}
                    className="rounded-md border border-[#ded8ca] px-3 py-3 text-left text-sm transition hover:border-[#2f6f5e] hover:bg-[#f6faf6]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-lg border border-[#ded8ca] bg-white">
              <div className="flex items-center justify-between border-b border-[#ebe6dc] px-4 py-4">
                <div>
                  <h3 className="text-base font-semibold">
                    Central de lembretes WhatsApp
                  </h3>
                  <p className="mt-1 text-sm text-[#60725a]">
                    Mensagens prontas para confirmar agenda e evitar perda de
                    retorno.
                  </p>
                </div>
                <span className="rounded-full bg-[#edf4ec] px-3 py-1 text-xs font-semibold text-[#2f6f5e]">
                  {reminders.length} contatos
                </span>
              </div>

              <div className="divide-y divide-[#ebe6dc]">
                {reminders.map((reminder) => (
                  <div
                    key={`${reminder.phone}-${reminder.reason}`}
                    className="grid gap-4 px-4 py-4 lg:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">
                          {reminder.tutor} - {reminder.pet}
                        </p>
                        <span className="rounded-full bg-[#faf3dc] px-2 py-1 text-xs font-medium text-[#8a6b1f]">
                          {reminder.priority}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#37413a]">
                        {reminder.reason}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#60725a]">
                        <span>Disparo sugerido: {reminder.due}</span>
                        <span className="font-mono">{reminder.phone}</span>
                      </div>
                    </div>

                    <a
                      className="inline-flex items-center justify-center rounded-md bg-[#2f6f5e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#285f51]"
                      href={buildWhatsappLink(reminder.phone, reminder.message)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Abrir WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[#ded8ca] bg-[#20251f] text-white">
              <div className="border-b border-white/10 px-4 py-4">
                <h3 className="text-base font-semibold">Prioridades do turno</h3>
                <p className="mt-1 text-sm text-[#b8c7b0]">
                  Ordem sugerida para uma equipe enxuta atender logo cedo.
                </p>
              </div>
              <div className="grid gap-3 px-4 py-4 text-sm">
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#b8c7b0]">
                    1. Confirmacoes
                  </p>
                  <p className="mt-2 leading-6">
                    Disparar primeiro os lembretes de agenda das 08:30 e 10:00.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#b8c7b0]">
                    2. Retornos
                  </p>
                  <p className="mt-2 leading-6">
                    Recuperar clientes atrasados antes do meio-dia aumenta a
                    chance de resposta.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#b8c7b0]">
                    3. Recompra
                  </p>
                  <p className="mt-2 leading-6">
                    Reservar o fim da tarde para racao e medicamentos com
                    recorrencia.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-lg border border-[#ded8ca] bg-white">
            <div className="flex items-center justify-between border-b border-[#ebe6dc] px-4 py-4">
              <h3 className="text-base font-semibold">Clientes recentes</h3>
              <span className="text-sm text-[#60725a]">4 registros</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[#faf8f2] text-[#60725a]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Tutor</th>
                    <th className="px-4 py-3 font-medium">Pet</th>
                    <th className="px-4 py-3 font-medium">WhatsApp</th>
                    <th className="px-4 py-3 font-medium">Etiqueta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebe6dc]">
                  {customers.map((customer) => (
                    <tr key={customer.phone}>
                      <td className="px-4 py-4 font-medium">{customer.name}</td>
                      <td className="px-4 py-4">{customer.pet}</td>
                      <td className="px-4 py-4 font-mono">{customer.phone}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-md bg-[#edf4ec] px-2 py-1 text-xs font-medium text-[#2f6f5e]">
                          {customer.tag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
