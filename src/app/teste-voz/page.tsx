"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type BrowserVoice = SpeechSynthesisVoice;

export default function TesteVozGratuita() {
  const [texto, setTexto] = useState("Olá! Esta é uma demonstração gratuita do Cláudio Voice Studio.");
  const [vozes, setVozes] = useState<BrowserVoice[]>([]);
  const [selecionada, setSelecionada] = useState("");
  const [velocidade, setVelocidade] = useState(1);
  const [tom, setTom] = useState(1);
  const [estado, setEstado] = useState("Pronto para testar");
  const disponivel = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const atualizar = () => {
      const todas = synth.getVoices();
      const portugues = todas.filter(v => v.lang.toLowerCase().startsWith("pt"));
      setVozes(portugues.length ? portugues : todas);
      setSelecionada(anterior => anterior || (portugues[0] || todas[0])?.voiceURI || "");
    };
    atualizar();
    synth.addEventListener("voiceschanged", atualizar);
    return () => { synth.cancel(); synth.removeEventListener("voiceschanged", atualizar); };
  }, []);

  const selecionadaAtual = useMemo(() => vozes.find(v => v.voiceURI === selecionada), [vozes, selecionada]);

  function falar() {
    if (!disponivel || !texto.trim()) return;
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(texto.trim());
    fala.lang = selecionadaAtual?.lang || "pt-BR";
    fala.voice = selecionadaAtual || null;
    fala.rate = velocidade;
    fala.pitch = tom;
    fala.onstart = () => setEstado("Reproduzindo");
    fala.onend = () => setEstado("Concluído");
    fala.onerror = (e) => setEstado(e.error === "canceled" ? "Interrompido" : "Erro ao reproduzir");
    window.speechSynthesis.speak(fala);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-5 px-5 py-8">
      <Link href="/" className="text-sm underline">Voltar ao início</Link>
      <h1 className="text-3xl font-semibold">Teste gratuito de vozes</h1>
      <p className="text-sm text-muted-foreground">Demonstração usando as vozes instaladas no seu aparelho ou navegador. Sem API, sem assinatura e sem cobrança por caractere. A qualidade e a quantidade de vozes dependem do dispositivo. Este modo não clona vozes e não exporta MP3.</p>
      <label className="flex flex-col gap-2 font-medium">Texto
        <textarea className="min-h-36 rounded-lg border bg-background p-3 font-normal" value={texto} onChange={e => setTexto(e.target.value)} maxLength={3000} />
      </label>
      <label className="flex flex-col gap-2 font-medium">Escolher voz
        <select className="rounded-lg border bg-background p-3 font-normal" value={selecionada} onChange={e => setSelecionada(e.target.value)}>
          {vozes.length === 0 && <option value="">Nenhuma voz detectada</option>}
          {vozes.map((v, i) => <option key={v.voiceURI + i} value={v.voiceURI}>{v.name} ({v.lang})</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-2">Velocidade: {velocidade.toFixed(1)}x
        <input type="range" min="0.5" max="1.5" step="0.1" value={velocidade} onChange={e => setVelocidade(Number(e.target.value))}/>
      </label>
      <label className="flex flex-col gap-2">Tom: {tom.toFixed(1)}
        <input type="range" min="0.5" max="1.5" step="0.1" value={tom} onChange={e => setTom(Number(e.target.value))}/>
      </label>
      <div className="flex gap-3">
        <button type="button" className="rounded-lg bg-foreground px-5 py-3 text-background disabled:opacity-50" disabled={!disponivel || vozes.length===0 || !texto.trim()} onClick={falar}>Ouvir voz</button>
        <button type="button" className="rounded-lg border px-5 py-3" onClick={() => { if (disponivel) window.speechSynthesis.cancel(); setEstado("Interrompido"); }}>Parar</button>
      </div>
      <p role="status" className="text-sm">{disponivel ? estado : "Este navegador não oferece síntese de voz."}</p>
      <p className="text-xs text-muted-foreground">A geração avançada com Chatterbox continuará separada até termos uma infraestrutura adequada. Esta tela é um teste de compatibilidade, não uma substituição do modelo profissional.</p>
    </main>
  );
}
