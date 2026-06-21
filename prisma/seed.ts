import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import {
  AppointmentStatus,
  InteractionChannel,
  PetSpecies,
  PrismaClient,
  ReminderStatus,
  ReminderType,
  UserRole,
} from "../src/generated/prisma/client";

const DEMO_DOCUMENT = "00.000.000/0001-90";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

function daysFromNow(days: number, hour: number, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

async function main() {
  await prisma.company.deleteMany({
    where: {
      document: DEMO_DOCUMENT,
    },
  });

  const company = await prisma.company.create({
    data: {
      name: "Pet Feira Demo LTDA",
      tradeName: "Pet Feira Demo",
      document: DEMO_DOCUMENT,
      phone: "(75) 3000-0000",
      whatsapp: "5575999990000",
      city: "Feira de Santana",
      state: "BA",
      neighborhood: "Centro",
      users: {
        create: [
          {
            name: "Dona Ana",
            email: "ana@petfeirademo.com.br",
            role: UserRole.OWNER,
          },
          {
            name: "Lucas Atendimento",
            email: "lucas@petfeirademo.com.br",
            role: UserRole.ATTENDANT,
          },
        ],
      },
    },
  });

  const [banhoTosa, vacina] = await Promise.all([
    prisma.service.create({
      data: {
        companyId: company.id,
        name: "Banho e tosa",
        category: "Banho e tosa",
        durationMinutes: 90,
        price: "85.00",
      },
    }),
    prisma.service.create({
      data: {
        companyId: company.id,
        name: "Vacina anual",
        category: "Veterinario",
        durationMinutes: 30,
        price: "120.00",
      },
    }),
  ]);

  const [racao, antipulgas] = await Promise.all([
    prisma.product.create({
      data: {
        companyId: company.id,
        name: "Racao premium adulto 10kg",
        category: "Racao",
        sku: "DEMO-RACAO-10KG",
        repurchaseDays: 30,
        price: "189.90",
      },
    }),
    prisma.product.create({
      data: {
        companyId: company.id,
        name: "Antipulgas mensal",
        category: "Medicamento",
        sku: "DEMO-ANTIPULGAS",
        repurchaseDays: 28,
        price: "64.90",
      },
    }),
  ]);

  const maria = await prisma.customer.create({
    data: {
      companyId: company.id,
      name: "Maria do Tomba",
      whatsapp: "5575988881111",
      neighborhood: "Tomba",
      tags: ["recorrente", "banho-e-tosa"],
      notes: "Prefere atendimento pela manha e confirmacao por WhatsApp.",
      pets: {
        create: {
          companyId: company.id,
          name: "Mel",
          species: PetSpecies.DOG,
          breed: "Shih-tzu",
          weightKg: "5.80",
        },
      },
    },
    include: {
      pets: true,
    },
  });

  const joao = await prisma.customer.create({
    data: {
      companyId: company.id,
      name: "Joao da Queimadinha",
      whatsapp: "5575977772222",
      neighborhood: "Queimadinha",
      tags: ["recompra", "racao"],
      notes: "Compra racao mensalmente e costuma responder apos 18h.",
      pets: {
        create: {
          companyId: company.id,
          name: "Thor",
          species: PetSpecies.DOG,
          breed: "SRD",
          weightKg: "18.40",
        },
      },
    },
    include: {
      pets: true,
    },
  });

  const carla = await prisma.customer.create({
    data: {
      companyId: company.id,
      name: "Carla do Sim",
      whatsapp: "5575966663333",
      neighborhood: "SIM",
      tags: ["vacina", "vip"],
      notes: "Cliente valoriza historico de vacinas organizado.",
      pets: {
        create: {
          companyId: company.id,
          name: "Luna",
          species: PetSpecies.CAT,
          breed: "Siames",
          weightKg: "4.10",
        },
      },
    },
    include: {
      pets: true,
    },
  });

  const appointmentMel = await prisma.appointment.create({
    data: {
      companyId: company.id,
      customerId: maria.id,
      petId: maria.pets[0].id,
      serviceId: banhoTosa.id,
      scheduledAt: daysFromNow(1, 9),
      status: AppointmentStatus.PENDING_CONFIRMATION,
      notes: "Confirmar horario e lembrar coleira.",
    },
  });

  const appointmentLuna = await prisma.appointment.create({
    data: {
      companyId: company.id,
      customerId: carla.id,
      petId: carla.pets[0].id,
      serviceId: vacina.id,
      scheduledAt: daysFromNow(2, 15, 30),
      status: AppointmentStatus.CONFIRMED,
      notes: "Trazer carteira de vacinacao.",
    },
  });

  await prisma.sale.create({
    data: {
      companyId: company.id,
      customerId: joao.id,
      soldAt: daysFromNow(-24, 17),
      total: "254.80",
      notes: "Venda demonstrativa para gerar oportunidade de recompra.",
      items: {
        create: [
          {
            productId: racao.id,
            name: racao.name,
            quantity: 1,
            unitPrice: "189.90",
          },
          {
            productId: antipulgas.id,
            name: antipulgas.name,
            quantity: 1,
            unitPrice: "64.90",
          },
        ],
      },
    },
  });

  await prisma.interaction.createMany({
    data: [
      {
        companyId: company.id,
        customerId: maria.id,
        petId: maria.pets[0].id,
        channel: InteractionChannel.WHATSAPP,
        summary: "Cliente pediu encaixe para banho e tosa da Mel.",
        happenedAt: daysFromNow(-1, 11),
      },
      {
        companyId: company.id,
        customerId: joao.id,
        petId: joao.pets[0].id,
        channel: InteractionChannel.IN_PERSON,
        summary: "Compra de racao e antipulgas para Thor.",
        happenedAt: daysFromNow(-24, 17),
      },
      {
        companyId: company.id,
        customerId: carla.id,
        petId: carla.pets[0].id,
        channel: InteractionChannel.PHONE,
        summary: "Confirmou disponibilidade para vacina da Luna.",
        happenedAt: daysFromNow(-2, 16),
      },
    ],
  });

  await prisma.reminder.createMany({
    data: [
      {
        companyId: company.id,
        customerId: maria.id,
        petId: maria.pets[0].id,
        appointmentId: appointmentMel.id,
        type: ReminderType.APPOINTMENT_CONFIRMATION,
        status: ReminderStatus.OPEN,
        dueAt: daysFromNow(0, 16),
        message:
          "Ola, Maria! Podemos confirmar o banho e tosa da Mel para amanha de manha?",
      },
      {
        companyId: company.id,
        customerId: joao.id,
        petId: joao.pets[0].id,
        productId: racao.id,
        type: ReminderType.FOOD_REPURCHASE,
        status: ReminderStatus.OPEN,
        dueAt: daysFromNow(5, 10),
        message:
          "Ola, Joao! A racao do Thor deve estar perto de acabar. Quer reservar outro pacote?",
      },
      {
        companyId: company.id,
        customerId: carla.id,
        petId: carla.pets[0].id,
        appointmentId: appointmentLuna.id,
        type: ReminderType.VACCINE_RETURN,
        status: ReminderStatus.OPEN,
        dueAt: daysFromNow(1, 9),
        message:
          "Ola, Carla! Passando para lembrar da vacina da Luna nesta semana.",
      },
    ],
  });

  await prisma.service.create({
    data: {
      companyId: company.id,
      name: "Consulta clinica",
      category: "Veterinario",
      durationMinutes: 40,
      price: "95.00",
    },
  });

  console.log("Seed demonstrativo criado para Pet Feira Demo.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
