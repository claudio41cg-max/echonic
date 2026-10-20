import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Readiness only. Never calls a GPU provider, never exposes an API key,
 * never starts paid inference and never bypasses Echonic's billing middleware.
 */
export async function GET() {
  const endpoint = process.env.CHATTERBOX_API_URL;
  let configured = false;
  if (endpoint) {
    try {
      const parsed = new URL(endpoint);
      configured = ["https:", "http:"].includes(parsed.protocol)
        && Boolean(process.env.CHATTERBOX_API_KEY);
    } catch {
      configured = false;
    }
  }
  return NextResponse.json({
    motor: "Chatterbox",
    configurado: configured,
    modoGratuito: "Vozes do navegador",
    geracaoProfissionalLiberada: false,
    aviso: configured
      ? "Há credenciais configuradas, mas esta verificação não testa o motor nem libera geração."
      : "Nenhum motor Chatterbox está preparado para uso neste ambiente.",
  }, { headers: { "Cache-Control": "no-store" } });
}
