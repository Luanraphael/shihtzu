# Auditoria da referência — EveryDoggy `config=customV2`, `tariff=v41`

**URL auditada:** `https://webapp.everydoggy.com/onboarding/?config=customV2&everydoggyV5=true&tariff=v41&fbpxls[0]=doggy3rd_intro&pcfg=customV2`
**Data:** 12/10/2026 · **Ferramenta:** Playwright (Chromium headless, `locale=pt-BR`, `timezone=America/Sao_Paulo`), dirigido por HTTP local (`audit/ed/driver.py`).
**Viewports:** 390×844 (percurso completo, DPR 2) e 1440×900 (percurso alternativo). Evidências em `audit/ed/shots/` (screenshots), `audit/ed/dom/` (HTML de cada etapa), `audit/ed/src/` + `audit/ed/paysrc/` (bundles JS/CSS servidos pela referência), `audit/ed/all.css` / `audit/ed/pay.css` (CSS consolidado).

> Método: além de navegar, os bundles JS/CSS servidos ao navegador foram lidos. Isso deu a ordem exata das etapas (array `customV18`, para o qual `customV2` é mapeado no `main.js`), os tempos (`setTimeout`/`setInterval`/`requestAnimationFrame`), os keyframes e os valores de CSS — em vez de estimativas a partir de vídeo. Onde um valor foi **medido no código**, ele aparece como `reference-measured` em `src/lib/timing.ts`.

## Ordem real das etapas (fonte: `main.a4d19ba9.js`, módulo 5656, `customV18`)

| # | id na referência | Tipo | Seção da barra (progressTitle) |
|---|---|---|---|
| 1 | `customV2_startPageV4` | HERO rotativo + loader 5s + aceite + Continuar | (sem header) |
| 2 | `customV2_gender` | Escolha única, autoavança | "Sobre o seu cão" |
| 3 | `customV2_name` | Input texto + Continuar / "Prefiro não dizer" | idem |
| 4 | `customV2_age` | Escolha única, autoavança (título interpola nome) | idem |
| 5 | `customV2_breed` | Busca com autocomplete + Continuar / "Não sei a raça" | idem |
| 6 | `customV2_health` | Múltipla, "Meu cachorro é saudável" exclusiva, + "Nenhum dos anteriores" | idem |
| 7 | `customV2_info_breed` | Transição: arte orbital + título com raça + Continuar | (sem header) → inicia "Problemas de comportamento" |
| 8 | `customV2_potty` | Múltipla, "Tudo certo, sem problemas!" exclusiva | "Problemas de comportamento" |
| 9 | `customV2_potty_goal` | Escolha única, autoavança | idem |
| 10 | `customV2_issues` | Múltipla (5 opções, inclui gaiola) | idem |
| 11 | `statement_irritation` | Afirmação + imagem + slider 0–100 (padrão 50) | idem |
| 12 | `customV2_walking_issues` | Múltipla (5) | idem |
| 13 | `customV2_activity` | Escolha única (3), autoavança | idem |
| 14 | `customV2_info_breed_2` | Transição: foto da equipe + "Nós te ouvimos!" | (sem header) → inicia "Visão geral do treinamento" |
| 15 | `customV2_command_1` | Múltipla em chips (11) + "Nenhum dos anteriores" | "Visão geral do treinamento" |
| 16 | `statement_ignore_commands` | Afirmação + slider | idem |
| 17 | `customV2_reason` | **Escolha única** com check + Continuar (não autoavança) + "Nenhum dos anteriores" | idem |
| 18 | `customV2_date` | Campo `dd/mm/aaaa` sobre `<input type=date>` nativo (abre calendário; mínimo = hoje) + "Já aconteceu" logo abaixo + Continuar + "Saltar esta pergunta" | idem |
| 19 | `customV2_info_predict` | Gráfico animado (SVG) | (sem header, botão voltar próprio) |
| 20 | `customV2_training_time` | Escolha única (4), autoavança | idem |
| 21 | `customV2_training` | Escolha única (3), autoavança | idem |
| 22 | `age_group` | Escolha única (faixa etária do tutor), autoavança | idem |
| 23 | `statement_strong_bond` | Afirmação + slider (gradiente invertido: laranja→verde) | idem |
| 24 | `customV2_creating_program` | 4 barras sequenciais + pop-up de pergunta + carrossel de depoimentos | (sem barra de progresso) |
| 25 | `customV2_plan` | "Plano pronto": card de perfil com foto da raça | idem |
| 26 | `customV2_email` | Input e-mail + aviso de privacidade + "Obter o meu plano" | idem |
| 27 | `receive_email` | Consentimento de e-mail marketing (2 botões) | idem |
| 28 | `customV2_specialOffer_v2` | Gamificação de 4 cartas (`p20v76_discountScreen_4cards=true`) | idem |
| → | `/pay/` | Paywall (outro app) + checkout em modal | — |

A ordem é a mesma em mobile e desktop. Desktop = mesma coluna centralizada (`max-width` 430–465px), fundo creme em toda a largura.

## Ramificações verificadas

| Situação | Comportamento observado | Evidência |
|---|---|---|
| Motivo 1–7 → data preenchida ou "Já aconteceu" | Mostra `info_predict` (gráfico) | `s17_date`, `s18_predict` |
| Motivo 8 ("Não, só quero um animal bem-comportado!") | **Pula data e gráfico**; voltar de "minutos por dia" retorna ao motivo | desktop `d17_after_reason_v8` + back |
| "Nenhum dos anteriores" no motivo | Pula data e gráfico | `d18_reason_none` |
| "Saltar esta pergunta" na data | `numberOfSteps: 2` → pula data e gráfico | código `ActionBarWithSkip` + `d20_after_skip` |
| Título da data | Um título por motivo (`customV2_date_title_v1..v7`) | locale |
| Motivo | Seleção **única**: marcar outro desmarca o anterior | `s16b_reason_sel` |
| Saúde | "Meu cachorro é saudável" desmarca as demais e vice-versa | `s05b/s05c` |
| Xixi | "Tudo certo, sem problemas!" exclusiva | `s07b/s07c` |
| Links "Nenhum dos anteriores" | Limpa respostas da etapa e avança | código `ActionBarWithSkip` |
| Nome não informado | Títulos usam "o seu cão" | desktop `d03_age` |
| Raça desconhecida | `info_breed` usa "Mais de 1,5 milhões de cães" | desktop `d06_info_breed` |
| Data digitada anterior a hoje | É substituída por hoje (`e<i` → hoje) | código `date` |
| Data → gráfico | Data do gráfico = `max(hoje+7, data do evento)`; meta = comandos + 4/7/14/7·semanas (máx. 50) conforme distância | código `infoPredict` |
| Sem data ("Já aconteceu") | Data = hoje+7; meta = comandos marcados + 7 | `s18_predict` (3 comandos → "Mais de 10", "Outubro 19") |

## Medidas de layout e tipografia (computed styles / CSS servido)

- **Fundo:** `#FFFBF1` (creme). Texto principal `#231E19`; secundário `#7B766F`.
- **Fontes:** títulos/opções `"SF Pro Rounded", Nunito, Roboto, sans-serif`; textos `"SF Pro", -apple-system, Roboto, sans-serif`. A referência **só embute Nunito** (`@font-face`, woff2 variável); SF Pro é fonte de sistema Apple e não é distribuída. Em Android/Windows a referência renderiza Nunito + Roboto/Arial — reproduzido com a mesma pilha, Nunito via `next/font` (licença OFL).
- **Título de etapa:** 24px/28px, peso 700, `letter-spacing:-.6px`, centralizado.
- **Header:** 72px, borda inferior `#ECE5D8`, botão voltar 40×40 r12 `#F3EDDF` (hover `#E5DED1`, active `#D1CABC`), logo 132×32.
- **Barra de progresso:** 3 seções (`max-width:260px`, gap 6px, altura 6px, r6, trilho `#E3DDD2`, preenchimento `#AE66F6`, `transition: width .4s ease`); rótulo 12px/16px 700 caixa-alta `#7B766F`, `letter-spacing:.4px`.
- **Opção:** altura 60px, r16, fundo `#FFFBF1`, `box-shadow: 0 0 0 2px #F7E7D6` (hover `#E0D4C6`, selecionada `0 0 0 3px #AE66F6`), texto 16px/20px 600 `-.4px`, ícone 20px a 16px da borda, margem 12px; check roxo 24px à direita na múltipla.
- **Botão primário:** 60px, r48, `#BA61FE`, texto 22px/28px 700 `#FFFBF1`; hover `#9D50D5`, active `#7D39AE`; desabilitado (opacidade, `#D7B0F4`).
- **Link secundário ("Nenhum dos anteriores"):** 15px/20px, `#BA61FE`.
- **Cor-tema (roxo) → substituída por azul:** `#AE66F6`, `#BA61FE`, `#C85BFF` (destaques), `#9D50D5`/`#7D39AE` (hover/active).
- **Transição entre etapas:** `opacity` com `transition: all .1s` (etapas vizinhas pré-renderizadas com `opacity:0`); botões aguardam 300 ms antes de navegar; `preventAction: 500ms` bloqueia cliques duplos.

## Animações (valores lidos no código)

| Componente | Medida |
|---|---|
| HERO — rodízio | `setInterval` 2000 ms; slide ativo: keyframe 2 s `opacity 0→1 (25%)→1 (75%)→0` + `scale 1.1→1`; 1º slide estático até o 1º tick; `mix-blend-mode: darken` |
| HERO — loader | 5000 ms linear (rAF), barra `#BA61FE` com patinha branca na ponta; brilhos em 15/40/80/90%; ao terminar: some o loader e aparecem aceite + "Continuar" |
| Gráfico (`info_predict`) | Curva SVG `stroke-dasharray:350` → `dashoffset 0` em **2 s ease**; ponto inicial `animMark` 1 s (delay .3 s); card "Nível atual" fade .6 s (delay .3 s); card "Objetivo" fade .6 s (delay 1 s); ponto final 1 s (delay 1.2 s); linha tracejada final .6 s (delay 2 s); confete do troféu .7 s (delay 2 s). Dispara via `IntersectionObserver` (threshold .5) |
| Loading de 4 barras | Cada barra soma `100/120` por frame (≈2 s a 60 fps), em sequência; a 2ª para em 89% e abre pop-up (fundo `#26242080`, fade .4 s / modal .2 s+.2 s); após resposta: fecha em 600 ms, barra 2 vai a 90% e continua; navegação 5200 ms após a resposta. Itens inativos com opacidade .4 |
| Carrossel de depoimentos | Glide `carousel`, `autoplay: 4000`, `peek 20px` |
| Cartas | faceUp: título 0 ms, cartas 300 ms (pop-in .7 s, +180 ms por carta), subtítulo 1100 ms, rodapé 1500 ms → vira 2200 ms (`rotateY 180`, .6 s cubic-bezier(.4,0,.2,1)) → embaralha 3× (80/580/1080 ms, transição 400 ms) → seleção 1580 ms (hover `scale 1.07`, glow 2 s). Clique: carta gira 360° (.6 s) → 900 ms junta no centro (600 ms) e as outras somem → 1700 ms celebração (fade .45 s, carta "win-card-pop" .9 s, textos .5 s com delays .25/.4 s, rodapé .45 s delay .65 s, anéis de pontos girando 16 s/9 s, halo 18 s, confete canvas 180 partículas, ≤4 s) |
| Slider | `input range` 0–100, padrão 50; 5 segmentos cinza `#D1D5DB` sobre gradiente `270deg #FF8E00 → #C4D200 (35–54%) → #00A470`; thumb 36×28 roxo com chevrons |

## Dados reaproveitados em telas posteriores

Nome (títulos de idade/plano), raça (`info_breed`, loading barra 3, plano, paywall `breedName`), idade (plano, paywall gráfico de idade), problemas (plano "Problemas comportamentais"), contagem de comandos (gráfico, plano), data do evento (gráfico), e-mail (checkout).

## Página de venda (`/pay/`) — ordem das seções

1. Barra fixa laranja "A oferta pessoal expira" + contagem 10:00 → 00:00
2. Imagem antes/depois
3. Headline "O último programa de treino de que vai precisar começa agora!"
4. Card "98% dos nossos usuários…" com avatares
5. "Um programa. Bom comportamento para toda a vida" — gráfico de arco por idade (1-2, 3, 4, 5+ anos; legenda "Tempo de treino"/"Resultados duradouros")
6. "O que torna a Everydoggy tão eficaz" — 6 benefícios com ícones coloridos
7. "Escolha seu plano" — card de cupom (60% de desconto, "Código promocional aplicado!", código `Nome_oct26`, contagem)
8. 3 planos: 7 dias / 4 semanas ("O MAIS POPULAR", pré-selecionado) / 12 semanas — preço riscado, preço com desconto, "por dia"
9. Nota "98%…"
10. CTA "Obter meu plano →"
11. "Garantia de reembolso"
12. Box "Garantia de 30 dias para reembolso" com selo
13. FAQ (3 perguntas, acordeão)
14. "Tem uma pergunta?" e-mail de suporte
15. "Histórias de sucesso dos nossos utilizadores" (carrossel)
16. Rodapé (empresa, contato)

Checkout: modal "Checkout" com total, cartão de crédito / PayPal, e texto de renovação automática.

## Bloqueios e limites desta auditoria

- O checkout da referência não foi submetido (exigiria pagamento real).
- E-mail usado para avançar: `auditoria.teste@example.com` (domínio reservado, não é de ninguém).
- A arte orbital local (`órbita_encantada_de_shih_tzus.png`) **não existe** na pasta do usuário — ver `mapa-adaptacoes.md`.
