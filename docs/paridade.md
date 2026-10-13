# Auditoria de paridade (Fase 7) — referência × local

Método: o mesmo conjunto de respostas foi aplicado na referência (`audit/ed/driver.py`, porta 8765) e no app local (`npm start`, porta 3100, driver 8767). Screenshots 390×844 DPR 2 por etapa; comparativos lado a lado em `audit/ed/compare/cmp_00..07.jpg` (REF à esquerda, LOCAL à direita). Animações comparadas por sequência de frames (`audit/ed/shots/predict_*`, `L_predict_*`, `cards_*`, `L_cards_*`, `hero_*`, `L_hero_*`, `creating_*`, `L_creating_*`).

## Diferenças encontradas e corrigidas

| # | Diferença | Causa | Correção |
|---|---|---|---|
| 1 | Títulos/opções mais finos que na referência | A referência declara a Nunito com uma única face `font-weight: 900`; fora de aparelhos Apple todo texto arredondado sai em 900. Nós carregávamos a fonte variável. | `next/font` carrega só o peso 900 (mesmo comportamento). Captura confirma o mesmo peso. |
| 2 | Botão "Continuar" ~18 px mais baixo nas telas sem link secundário | Barra de ação com 80 px nessas telas; na referência é sempre 108 px. | Removida a variante reduzida. |
| 3 | Ilustrações do HERO menores que na referência | As artes têm margem branca embutida. | Recorte centrado no desenho na proporção 750:660 da referência. |
| 4 | Ilustrações das afirmações altas demais | Proporção das artes locais ≠ 350×130 da referência. | Caixa com `aspect-ratio 2.69` + `object-fit: contain` + recorte das margens. |
| 5 | Hero do paywall cortando os cães | `object-fit: cover`. | `contain` sobre fundo branco. |
| 6 | Rótulos de idade sobre o arco no paywall | Raio do arco grande demais para as posições de rótulo da referência. | Raio 205 / traço 42–56. |
| 7 | Título do cupom colidindo com a etiqueta "60% de desconto" | Etiqueta PT-BR mais larga. | `padding-right: 128px`. |
| 8 | Fecho do gráfico falava em "comportamentos que atrapalham" mesmo sem problemas marcados | Copy fixa. | Texto alternativo de bons hábitos. |

## Diferenças restantes (intencionais ou por falta de insumo)

- **Logo/marca:** placeholder "Shih Tzu Educado" com patinha azul (marca real pendente).
- **Ícones de opção:** desenhados com lucide-react (mesmo tamanho 20 px, cor `#7B766F`), não os SVG proprietários da referência; semântica equivalente.
- **Pelagem:** a referência usa busca de raça; aqui, por aprovação (§B), opções no estilo da referência com retrato de 48 px.
- **Órbita:** composição montada com os 6 retratos locais (a arte orbital pronta não foi fornecida).
- **Depoimentos** (loading e paywall): ocultos até haver depoimentos legítimos em `OFFER.testimonials`.
- **"98%", "30 dias", "treinadores certificados", "15 minutos", "70+/80+":** substituídos por textos verdadeiros/neutros; ativáveis em `OFFER.claims` com documentação.
- **Imagem do e-mail opt-in:** a referência usa um cão em traço com envelope; usamos a arte do frisbee (asset local).
- **Contagem regressiva:** é real — ao zerar, a oferta volta ao preço cheio e ao checkout sem desconto (`OFFER.countdown.enforce`).
- **Checkout:** a referência abre um modal de pagamento próprio; aqui o CTA leva à URL de checkout configurada (com UTMs, `fbclid` e e-mail). Pendente de URL real.
- **Faixa amarela "Configuração comercial pendente"** no paywall enquanto `OFFER.approved` for `false`.

## Testes executados

- Unitários (`npm test`): 13/13 — ordem das etapas, 7 ramificações de data, pulos (motivo 8 / Nenhuma / Pular), progresso, hoje+7 sem UTC (virada de mês/ano/bissexto/meia-noite), meta do gráfico (9+ comandos), resumo de até 3 comportamentos (zero → bons hábitos), exclusividade, matemática de preços, validade do cupom.
- E2E no navegador (`audit/ed/walk_local.py`, `audit/ed/walk_alt.py`): percurso completo até `/oferta` com UTMs preservados; motivo 8 e "Nenhuma" pulam data+gráfico; voltar retorna ao motivo; 7 títulos de data com calendário + "Já aconteceu"; estado `past`/`null` e `scheduled`/data real; "Pular" pula o gráfico; 10 comandos → meta de aperfeiçoamento; zero problemas → texto de bons hábitos; cliques múltiplos nas cartas → uma revelação; recarregar não revela de novo; cupom aplicado e persistente após recarregar; reserva expirada → preço cheio.
- Viewports 375×812, 390×844, 428×926, 1440×900: overflow horizontal = 0.
- Console: 0 erros; rede: 0 respostas ≥ 400 (incluindo imagens).
- `npm run lint`, `tsc --noEmit`, `npm run build`: sem erros.
