import { getPrisma } from "@/lib/prisma";

const DEMO_COMPANY_DOCUMENT = "00.000.000/0001-90";

function getDemoCompanyDocument() {
  return process.env.CRM_DEMO_COMPANY_DOCUMENT || DEMO_COMPANY_DOCUMENT;
}

export async function listRecentCustomers(limit = 20) {
  const prisma = getPrisma();

  const customers = await prisma.customer.findMany({
    where: {
      company: {
        document: getDemoCompanyDocument(),
      },
    },
    include: {
      pets: {
        orderBy: {
          createdAt: "asc",
        },
        take: 3,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    whatsapp: customer.whatsapp,
    neighborhood: customer.neighborhood,
    tags: customer.tags,
    createdAt: customer.createdAt.toISOString(),
    pets: customer.pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
    })),
  }));
}

export async function listUpcomingAppointments(limit = 20) {
  const prisma = getPrisma();

  const appointments = await prisma.appointment.findMany({
    where: {
      company: {
        document: getDemoCompanyDocument(),
      },
      scheduledAt: {
        gte: new Date(),
      },
    },
    include: {
      customer: true,
      pet: true,
      service: true,
    },
    orderBy: {
      scheduledAt: "asc",
    },
    take: limit,
  });

  return appointments.map((appointment) => ({
    id: appointment.id,
    scheduledAt: appointment.scheduledAt.toISOString(),
    status: appointment.status,
    notes: appointment.notes,
    customer: {
      id: appointment.customer.id,
      name: appointment.customer.name,
      whatsapp: appointment.customer.whatsapp,
    },
    pet: {
      id: appointment.pet.id,
      name: appointment.pet.name,
      species: appointment.pet.species,
    },
    service: appointment.service
      ? {
          id: appointment.service.id,
          name: appointment.service.name,
          category: appointment.service.category,
          durationMinutes: appointment.service.durationMinutes,
        }
      : null,
  }));
}
