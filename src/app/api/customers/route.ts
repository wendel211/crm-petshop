import { NextResponse } from "next/server";

import { listRecentCustomers } from "@/lib/crm-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const customers = await listRecentCustomers();

    return NextResponse.json({
      customers,
    });
  } catch (error) {
    console.error("Erro ao listar clientes", error);

    return NextResponse.json(
      {
        error: "Nao foi possivel carregar os clientes agora.",
      },
      { status: 500 },
    );
  }
}
