# Cláudio Voice Studio: motor de voz

## Situação

A versão original do Echonic já possui o cliente HTTP `src/lib/chatterbox-client.ts` que chama `POST /generate`, enviando texto e identificação de amostra de voz. A resposta esperada é um WAV binário. O backend original **exige assinatura Polar ativa** antes de chamar a GPU, guarda o WAV no Cloudflare R2 e mantém histórico no PostgreSQL.

A página `/teste-voz` oferece uma alternativa inicial usando as vozes do próprio navegador Android, sem provedores externos e sem cobrança de API. Ela não é o Chatterbox e não faz clonagem nem exportação de MP3.

## Próximos requisitos para ativar o Chatterbox

1. Selecionar execução local em máquina compatível ou hospedagem com GPU com preço conhecido. GitHub sozinho não executa modelos de IA.
2. Configurar servidor autorizado e privado compatível com `POST /generate`. Não colocar credenciais no JavaScript do navegador.
3. Verificar licenças do modelo e consentimento de titulares de vozes.
4. Definir modo pessoal sem cobrança em rota protegida, sem abrir a geração para usuários anônimos nem remover a proteção do serviço original indiscriminadamente.
5. Testar um WAV real, validar custos e limites, e somente então habilitar geração de áudio profissional.

O endpoint `/api/voice-engine/status` informa apenas se variáveis estão presentes. Ele não testa disponibilidade do modelo, não gera áudio, não revela credenciais, não aciona GPU e não modifica cobrança.

Nenhum serviço pago deve ser ativado automaticamente.
