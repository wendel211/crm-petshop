"use client";

import { useState, useSyncExternalStore, useTransition } from "react";

const STORAGE_KEY = "crm-pet-feira-customers-v1";
const STORAGE_EVENT = "crm-pet-feira-customers-changed";
const emptyCustomers: CustomerRecord[] = [];

let storedCustomersCache: {
  parsed: CustomerRecord[];
  raw: null | string;
} = {
  parsed: emptyCustomers,
  raw: null,
};

type CustomerRecord = {
  id: string;
  name: string;
  pet: string;
  phone: string;
  tag: string;
  species: string;
  neighborhood: string;
  createdAt: string;
};

type CustomerFormState = {
  name: string;
  phone: string;
  pet: string;
  species: string;
  neighborhood: string;
  tag: string;
};

const initialFormState: CustomerFormState = {
  name: "",
  phone: "",
  pet: "",
  species: "Cachorro",
  neighborhood: "",
  tag: "Novo",
};

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

const defaultCustomers: CustomerRecord[] = [
  {
    id: "demo-mariana-luna",
    name: "Mariana Alves",
    pet: "Luna",
    phone: "(75) 99124-8821",
    tag: "VIP",
    species: "Cachorro",
    neighborhood: "Santa Monica",
    createdAt: "2026-06-07T08:15:00.000Z",
  },
  {
    id: "demo-joao-thor",
    name: "Joao Pereira",
    pet: "Thor",
    phone: "(75) 98802-1193",
    tag: "Vacina",
    species: "Cachorro",
    neighborhood: "SIM",
    createdAt: "2026-06-07T08:45:00.000Z",
  },
  {
    id: "demo-carla-mel",
    name: "Carla Souza",
    pet: "Mel",
    phone: "(75) 99744-3308",
    tag: "Retorno",
    species: "Gato",
    neighborhood: "Caseb",
    createdAt: "2026-06-06T14:20:00.000Z",
  },
  {
    id: "demo-rafael-bob",
    name: "Rafael Lima",
    pet: "Bob",
    phone: "(75) 98116-7520",
    tag: "Tosa",
    species: "Cachorro",
    neighborhood: "Brasilia",
    createdAt: "2026-06-06T16:05:00.000Z",
  },
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

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function buildWhatsappLink(phone: string, message: string) {
  const target = formatWhatsappNumber(phone);
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${target}?text=${encodedMessage}`;
}

function isCustomerRecord(value: unknown): value is CustomerRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.pet === "string" &&
    typeof candidate.phone === "string" &&
    typeof candidate.tag === "string" &&
    typeof candidate.species === "string" &&
    typeof candidate.neighborhood === "string" &&
    typeof candidate.createdAt === "string"
  );
}

function loadStoredCustomers() {
  if (typeof window === "undefined") {
    return emptyCustomers;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw === storedCustomersCache.raw) {
      return storedCustomersCache.parsed;
    }

    if (!raw) {
      storedCustomersCache = {
        parsed: emptyCustomers,
        raw: null,
      };

      return storedCustomersCache.parsed;
    }

    const parsed = JSON.parse(raw);
    const nextParsed = Array.isArray(parsed)
      ? parsed.filter(isCustomerRecord)
      : emptyCustomers;

    storedCustomersCache = {
      parsed: nextParsed,
      raw,
    };

    return storedCustomersCache.parsed;
  } catch {
    storedCustomersCache = {
      parsed: emptyCustomers,
      raw: null,
    };

    return storedCustomersCache.parsed;
  }
}

function subscribeToStoredCustomers(onChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorageChange = () => onChange();

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener(STORAGE_EVENT, handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener(STORAGE_EVENT, handleStorageChange);
  };
}

function saveStoredCustomers(customers: CustomerRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  const raw = JSON.stringify(customers);

  storedCustomersCache = {
    parsed: customers,
    raw,
  };

  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(STORAGE_EVENT));
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

export default function HomeDashboard() {
  const savedCustomers = useSyncExternalStore(
    subscribeToStoredCustomers,
    loadStoredCustomers,
    () => emptyCustomers,
  );
  const [form, setForm] = useState<CustomerFormState>(initialFormState);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSaving, startSaving] = useTransition();

  const todayLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  const visibleCustomers = [...savedCustomers, ...defaultCustomers]
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .slice(0, 8);

  function handleCreateCustomer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setError(null);

    const digits = form.phone.replace(/\D/g, "");

    if (!form.name || !form.pet || !form.neighborhood || digits.length < 10) {
      setError("Preencha tutor, WhatsApp, pet e bairro para salvar o cadastro.");
      return;
    }

    const nextCustomer: CustomerRecord = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`,
      name: form.name.trim(),
      pet: form.pet.trim(),
      phone: formatPhone(form.phone),
      tag: form.tag,
      species: form.species,
      neighborhood: form.neighborhood.trim(),
      createdAt: new Date().toISOString(),
    };

    const nextCustomers = [nextCustomer, ...savedCustomers].slice(0, 12);
    saveStoredCustomers(nextCustomers);

    startSaving(() => {
      setForm(initialFormState);
      setIsFormOpen(false);
      setFeedback(`Cadastro salvo: ${nextCustomer.name} e ${nextCustomer.pet}.`);
    });
  }

  function handleFormChange(field: keyof CustomerFormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "phone" ? formatPhone(value) : value,
    }));
  }

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
              <button
                className="rounded-md border border-[#c7c0b2] px-4 py-2 text-sm font-medium transition hover:bg-white"
                onClick={() => {
                  setFeedback(null);
                  setError(null);
                  setIsFormOpen((current) => !current);
                }}
                type="button"
              >
                {isFormOpen ? "Fechar cadastro" : "Novo cliente"}
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

          {isFormOpen ? (
            <section
              className="mt-6 rounded-lg border border-[#ded8ca] bg-white"
              id="cadastro-cliente"
            >
              <div className="flex flex-col gap-2 border-b border-[#ebe6dc] px-4 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-base font-semibold">
                    Cadastro rapido de tutor e pet
                  </h3>
                  <p className="mt-1 text-sm text-[#60725a]">
                    Primeiro passo funcional para registrar cliente, pet e
                    bairro com persistencia local.
                  </p>
                </div>
                <span className="rounded-full bg-[#edf4ec] px-3 py-1 text-xs font-semibold text-[#2f6f5e]">
                  {savedCustomers.length} salvos neste navegador
                </span>
              </div>

              <form
                className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3"
                onSubmit={handleCreateCustomer}
              >
                <label className="grid gap-2 text-sm">
                  Tutor responsavel
                  <input
                    className="rounded-md border border-[#d7d0c2] bg-[#fcfbf8] px-3 py-2 outline-none transition focus:border-[#2f6f5e] focus:bg-white"
                    onChange={(event) => handleFormChange("name", event.target.value)}
                    placeholder="Ex.: Ana Oliveira"
                    value={form.name}
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  WhatsApp
                  <input
                    className="rounded-md border border-[#d7d0c2] bg-[#fcfbf8] px-3 py-2 outline-none transition focus:border-[#2f6f5e] focus:bg-white"
                    inputMode="numeric"
                    onChange={(event) => handleFormChange("phone", event.target.value)}
                    placeholder="(75) 99999-0000"
                    value={form.phone}
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  Nome do pet
                  <input
                    className="rounded-md border border-[#d7d0c2] bg-[#fcfbf8] px-3 py-2 outline-none transition focus:border-[#2f6f5e] focus:bg-white"
                    onChange={(event) => handleFormChange("pet", event.target.value)}
                    placeholder="Ex.: Nina"
                    value={form.pet}
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  Especie
                  <select
                    className="rounded-md border border-[#d7d0c2] bg-[#fcfbf8] px-3 py-2 outline-none transition focus:border-[#2f6f5e] focus:bg-white"
                    onChange={(event) =>
                      handleFormChange("species", event.target.value)
                    }
                    value={form.species}
                  >
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                    <option value="Outros">Outros</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm">
                  Bairro
                  <input
                    className="rounded-md border border-[#d7d0c2] bg-[#fcfbf8] px-3 py-2 outline-none transition focus:border-[#2f6f5e] focus:bg-white"
                    onChange={(event) =>
                      handleFormChange("neighborhood", event.target.value)
                    }
                    placeholder="Ex.: SIM"
                    value={form.neighborhood}
                  />
                </label>

                <label className="grid gap-2 text-sm">
                  Etiqueta comercial
                  <select
                    className="rounded-md border border-[#d7d0c2] bg-[#fcfbf8] px-3 py-2 outline-none transition focus:border-[#2f6f5e] focus:bg-white"
                    onChange={(event) => handleFormChange("tag", event.target.value)}
                    value={form.tag}
                  >
                    <option value="Novo">Novo</option>
                    <option value="Banho e tosa">Banho e tosa</option>
                    <option value="Vacina">Vacina</option>
                    <option value="Clinica">Clinica</option>
                    <option value="Recompra">Recompra</option>
                  </select>
                </label>

                <div className="md:col-span-2 xl:col-span-3">
                  {error ? (
                    <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                      {error}
                    </p>
                  ) : null}

                  {feedback ? (
                    <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      {feedback}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center xl:col-span-3">
                  <button
                    className="inline-flex items-center justify-center rounded-md bg-[#2f6f5e] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#285f51] disabled:cursor-not-allowed disabled:bg-[#6c9187]"
                    disabled={isSaving}
                    type="submit"
                  >
                    {isSaving ? "Salvando..." : "Salvar cliente e pet"}
                  </button>
                  <p className="text-sm text-[#60725a]">
                    Os cadastros ficam salvos neste navegador enquanto a
                    persistencia PostgreSQL nao entra no proximo ciclo.
                  </p>
                </div>
              </form>
            </section>
          ) : null}

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
                      rel="noreferrer"
                      target="_blank"
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
            <div className="flex flex-col gap-2 border-b border-[#ebe6dc] px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-base font-semibold">Clientes recentes</h3>
                <p className="mt-1 text-sm text-[#60725a]">
                  Registros de demonstracao misturados com os cadastros locais
                  do turno.
                </p>
              </div>
              <span className="text-sm text-[#60725a]">
                {visibleCustomers.length} registros visiveis
              </span>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {visibleCustomers.map((customer) => (
                <article
                  key={`mobile-${customer.id}`}
                  className="rounded-lg border border-[#ebe6dc] bg-[#fcfbf8] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="mt-1 text-sm text-[#60725a]">
                        {customer.pet} - {customer.species}
                      </p>
                    </div>
                    <span className="rounded-md bg-[#edf4ec] px-2 py-1 text-xs font-medium text-[#2f6f5e]">
                      {customer.tag}
                    </span>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm text-[#37413a]">
                    <p className="font-mono">{customer.phone}</p>
                    <p>Bairro: {customer.neighborhood}</p>
                    <p className="text-[#60725a]">
                      Entrada: {formatTimestamp(customer.createdAt)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-[#faf8f2] text-[#60725a]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Tutor</th>
                    <th className="px-4 py-3 font-medium">Pet</th>
                    <th className="px-4 py-3 font-medium">Especie</th>
                    <th className="px-4 py-3 font-medium">WhatsApp</th>
                    <th className="px-4 py-3 font-medium">Bairro</th>
                    <th className="px-4 py-3 font-medium">Etiqueta</th>
                    <th className="px-4 py-3 font-medium">Entrada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebe6dc]">
                  {visibleCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-4 py-4 font-medium">{customer.name}</td>
                      <td className="px-4 py-4">{customer.pet}</td>
                      <td className="px-4 py-4">{customer.species}</td>
                      <td className="px-4 py-4 font-mono">{customer.phone}</td>
                      <td className="px-4 py-4">{customer.neighborhood}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-md bg-[#edf4ec] px-2 py-1 text-xs font-medium text-[#2f6f5e]">
                          {customer.tag}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-[#60725a]">
                        {formatTimestamp(customer.createdAt)}
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
