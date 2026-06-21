import { NextResponse } from "next/server";

import { listUpcomingAppointments } from "@/lib/crm-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const appointments = await listUpcomingAppointments();

    return NextResponse.json({
      appointments,
    });
  } catch (error) {
    console.error("Erro ao listar agenda", error);

    return NextResponse.json(
      {
        error: "Nao foi possivel carregar a agenda agora.",
      },
      { status: 500 },
    );
  }
}
