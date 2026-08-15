# Jogos Premium — como publicar e começar a vender

Este app foi feito aqui no Claude (por isso usa uma API de armazenamento
própria do Claude). Este pacote já vem "traduzido" pra rodar como um site
normal, publicável em qualquer serviço de hospedagem.

## 1. Terminar a parte do Stripe
No arquivo `src/App.jsx`, procure por:
- `UNLOCK_CODE = "PREMIUM990"`
- `STORE_CODE = "LOJA990"`

Troque a lógica desses dois pontos pelo seu Payment Link/Checkout real do
Stripe (mesmo fluxo que você já usa no Preço X e no NEURA.market). Enquanto
isso não for feito, qualquer pessoa que souber o código digita e libera
tudo de graça.

## 2. Publicar (duas opções)

### Opção A — Vercel (recomendada, você já tem conta)
1. Acesse vercel.com e entre com a conta que você já usa (asb178-7596)
2. "Add New" → "Project" → "Import" → suba esta pasta inteira (ou conecte
   a um repositório GitHub novo com esses arquivos)
3. Vercel detecta automaticamente que é um projeto Vite — não precisa
   configurar nada, só clicar em "Deploy"
4. Em alguns minutos você recebe um link tipo `jogos-premium.vercel.app`

### Opção B — Netlify
1. Acesse app.netlify.com
2. Arraste esta pasta pra área de deploy manual, ou conecte via GitHub
3. Build command: `npm run build` — Publish directory: `dist`

## 3. Transformar em app instalável (opcional)
Depois de publicado, você pode gerar um APK pra Android do mesmo jeito
que fez com o Preço X: cole o link publicado no PWABuilder
(pwabuilder.com) e gere o pacote.

## 4. Compartilhar
Depois de publicado, o link (ex: `https://jogos-premium.vercel.app`) é
o que você divulga no Instagram, WhatsApp, Facebook etc. — igual fez com
o NEURA.market e o Preço X.

## 5. Como o dinheiro chega até você
Assim que o Payment Link do Stripe estiver ativo no app publicado, cada
compra cai direto na sua conta Stripe (StaelRj), do mesmo jeito que os
outros projetos. Sem intermediário.

## Sobre o Ranking Online
O "Ranking Online" da Arena de Rastros usa uma função de armazenamento
compartilhado que só existe dentro do Claude. Neste pacote publicado, ela
foi trocada por armazenamento local do navegador — funciona, mas cada
pessoa só vê a própria pontuação, não a de todo mundo. Se quiser um
ranking de verdade compartilhado entre jogadores, dá pra ligar isso ao
Supabase (você já tem conta) — é só pedir.
