# Mapa de adaptações — referência × Shih Tzu (BR)

Regra: **ordem, layout, interação e tempos = referência**; **copy, assets, paleta e condicionais listados no briefing = adaptação**; o que não foi encontrado fica como pendência (seção final), sem invenção.

| # / id real | Comportamento original | Adaptação aprovada (briefing) |
|---|---|---|
| 1 `startPageV4` | 5 cenas de cão genérico + headline com prazo roxo ("em 3 dias"); loader 5 s com patinha; aceite pt-PT | Cenas do Shih Tzu na mesma correspondência (xixi, travesseiro, almofada, sozinho/gaiola, guia). Headlines sem prazos inventados (§A): "Pare com o **xixi fora do lugar**", "Acabe com os **comportamentos indesejados**", "Chega de **móveis e chinelos destruídos**", "Ajude seu Shih Tzu a ficar **tranquilo sozinho**", "Passeie **sem puxões na coleira**". Destaque azul. Aceite em PT-BR com links do operador. |
| 2 `gender` | "O seu cão é" Fêmea/Macho | "Seu Shih Tzu é" — mantido (não citado no briefing; preservado). Define ele/ela nas copies seguintes. |
| 3 `name` | Input + "Prefiro não dizer" | Mantido, PT-BR. Nome alimenta títulos e resumos. |
| 4 `age` | 5 faixas | Mantido, PT-BR ("0 a 6 meses"…). |
| 5 `breed` | Busca de raça | **Substituído por pelagem (§B)**: "Qual dessas opções mais se parece com o seu Shih Tzu?" + "Selecione a aparência mais próxima."; 7 opções no estilo de opção da referência com retrato recortado à esquerda; escolha única com autoavanço; salva `coatColor`. |
| 6 `health` | Múltipla + exclusiva | Mantido, PT-BR. |
| 7 `info_breed` | Arte orbital com foto da raça + "Mais de 150 mil cães da raça…" | Composição orbital montada com os **6 retratos locais** (dourado/branco no centro, 5 ao redor) — o arquivo orbital pronto não existe na pasta. Texto §C ("Agora que já conhecemos melhor…") — corresponde a esta transição real. Alegação "150 mil" removida. |
| 8 `potty` | 4 opções múltiplas, 4ª exclusiva | Copy §D, mesma ordem. |
| 9 `potty_goal` | 5 opções, única | Copy §E. |
| 10 `issues` | 5 opções (1ª = gaiola) | **Gaiola removida**; 4 opções §F na ordem: mãos/pés, late, destrói, chora sozinho. |
| 11 `statement_irritation` | Slider + imagem genérica | Copy §G + chinelo azul rasgado; slider mantido. |
| 12 `walking_issues` | 5 opções múltiplas | Copy §H. |
| 13 `activity` | 3 opções | Copy §I (3). |
| 14 `info_breed_2` | Foto da equipe + "Nós te ouvimos!" + "treinadores certificados" | §J: "Agora entendemos melhor o seu Shih Tzu! 🐶" + resumo dinâmico (até 3 comportamentos reais) + imagem da equipe Shih Tzu. "Treinadores certificados" e "10 minutos" **desligados** até comprovação (`src/config/offer.ts`), usando "treinos curtos e consistentes" / "é exatamente nisso que o plano vai ajudar". |
| 15 `command_1` | 11 chips | §K, 11 comandos com mesmos significados (ver ambiguidades abaixo) + "Nenhuma dessas opções". |
| 16 `statement_ignore_commands` | Slider | §L + pote na mesa. |
| 17 `reason` | Única, 8 opções + "Nenhum" | §M, 8 opções + "Nenhuma dessas opções". Seleção única (como na referência). |
| 18 `date` | Título por motivo; campo data; "Já aconteceu"; "Saltar" | 7 títulos §M; placeholder "Selecione a data"; calendário nativo (como a referência) — data mínima hoje; "Já aconteceu" logo abaixo → `eventStatus:"past"`, `eventDate:null`; data → `"scheduled"`. Datas em fuso local. |
| 19 `info_predict` | Gráfico "Mais de N comandos até <data>" com previsão estatística | §N: headline aprovada, "Meta: aprender mais de 9 comandos até {hoje+7}" apresentada como meta; sem "prevemos com base em outros usuários". Mesmo SVG/tempos. 9+ comandos já conhecidos → meta de aperfeiçoamento. |
| 20 `training_time` | 4 opções | §O. |
| 21 `training` | 3 opções | §P. |
| 22 `age_group` | Faixa etária do tutor | Mantido, PT-BR. |
| 23 `statement_strong_bond` | Slider | §Q + frisbee azul. |
| 24 `creating_program` | 4 barras + pop-up + depoimentos | §R (4 frases, 3ª adaptada aos problemas reais) + pop-up mantido em PT-BR. **Depoimentos ocultos** (não há depoimentos legítimos da nova oferta; componente pronto e configurável). |
| 25 `plan` | Card "Perfil de adestramento" com foto da raça | Foto = retrato da pelagem escolhida; dados reais do quiz. |
| 26 `email` | E-mail + privacidade | Mantido em PT-BR; e-mail só segue para o checkout (parâmetro configurável). |
| 27 `receive_email` | Consentimento | Mantido em PT-BR (opt-in explícito, LGPD). |
| 28 `specialOffer_v2` | 4 cartas 10/20/30/60%, sorteio aleatório | 4 cartas com verso azul/pata dourada; **todas as faces mostram 60% OFF** (resultado determinístico, sem sorteio fictício); flip 3D/embaralhar/confete preservados; "Você recebeu 60% de desconto!" + "Continuar". |
| `/pay/` | Paywall USD, 98%, 30 dias, depoimentos | Mesma ordem de seções; azul; preços/cupom/checkout/garantia/alegações vindos de `src/config/offer.ts`. Itens não comprovados ficam desligados ou com texto neutro verdadeiro. |

## Cor

Todos os usos de `#AE66F6`, `#BA61FE`, `#C85BFF`, `#9D50D5`, `#7D39AE` (cor-tema) → `--brand-primary: #2E60A6` e derivados (`--brand-hover`, `--brand-active`, `--brand-soft`, `--brand-disabled`). Fundo `#FFFBF1` → `#FFFFFF`. Cores funcionais mantidas: gradiente do slider (verde/amarelo/laranja), cards laranja/verde do gráfico, barra laranja de contagem, confete.

## Ambiguidades de comandos (§K) — significado preservado

| Referência (pt-PT) | `a_value` interno | Tradução aprovada |
|---|---|---|
| Nome | name | Atende quando chamo pelo nome |
| Anda | come | Vem quando eu chamo |
| Não | no | Para quando digo "Não!" |
| Condicionamento pela comida | food_luring | Segue um petisco quando mostro com a mão |
| Toca aqui! | high_five | Dá a patinha |
| Toca | touch | Encosta o focinho na minha mão |
| Olhar | look | Olha para mim quando peço |
| Em pé | stand | Fica em pé quando peço |
| Lugar | place | Vai para a caminha quando peço |
| Desça | off | Deita quando peço ⚠️ `off` no original é "descer" (de móveis/pessoas), não "deitar" (`down`). O briefing pede "Deita"; mantido conforme briefing e registrado aqui. |
| Larga | drop_it | Solta o que está na boca quando peço |

## Pendências (não inventadas — precisam do responsável)

1. **Marca** comercial, logotipo, domínio, razão social/CNPJ, e-mail de suporte.
2. **Preços reais** dos 3 planos (R$), periodicidade, renovação, e **URLs de checkout** (com e sem desconto).
3. **Cupom** real configurado no checkout (código).
4. **Garantia**: prazo e termos reais (padrão atual: direito de arrependimento de 7 dias do CDC art. 49).
5. Alegações: "98%", "mudanças em 1 semana", "treinadores certificados", "10/15 minutos por dia", "70+ aulas", "80+ jogos", "resultados em 4 semanas" — só ativar com documentação.
6. Depoimentos legítimos (com autorização) para o loading e o paywall.
7. IDs de pixel/UTMify desta oferta.
8. Arte orbital pronta (opcional — a composição com os 6 retratos já cumpre a função).
9. Imagem antes/depois do paywall (usamos composição de duas artes locais).
