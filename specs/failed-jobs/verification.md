# Verificação

Status: implementação verificada estaticamente; validação contra o ambiente autenticado pendente.

- AC-01 — PASS — `PageHeader` apresenta o título e descrição na rota `/failed-jobs`.
- AC-02 — PASS — `getFailedJobs` usa `client.failedJobs.getFailedJobs` e a rota mapeia o contrato beta.27 para as colunas apresentadas.
- AC-03 — PASS (estático) — o filtro aplicado no popover é enviado como `processInstanceId` na consulta, é omitido quando vazio e repõe `pageIndex=0` ao aplicar, remover o chip ou limpar.
- AC-04 — PASS (estático) — `badgeCount` e o contador acompanham `totalElements` da resposta; `notFoundLabel` cobre o estado vazio.
- AC-05 — PASS — “Ver erro” seleciona a linha, carrega a stack trace pelo cliente e abre o `IGRPCSheetPrimitive` à direita com cópia e dois controlos de fecho.
- AC-06 — PASS — a rota utiliza `PageHeader` e `IGRPDataTable`, como `process-instances`.
- AC-07 — PASS — “Reprocessar…” na tabela e no drawer abre `IGRPModalDialog` com o resumo do job e as ações solicitadas.
- AC-08 — PASS — a confirmação valida inteiros de 1 a 100, aceita vazio, chama o endpoint de retry e recarrega a lista em caso de sucesso.
- AC-09 — PASS — o drawer consulta a stack trace sob pedido e apresenta estados de carregamento e falha.
- AC-10 — PASS (estático) — a página solicita `pageIndex` e `PAGE_SIZE=25` ao cliente, permite navegar entre páginas com limites, mostra `totalPages` e recua para a última página válida quando a atual desaparece após atualização.
- AC-11 — PASS (estático/SDK) — o popover aplica `businessKey` em conjunto com o UUID quando preenchidos, omite valores vazios e repõe `pageIndex=0`. A documentação da API apresentada pelo utilizador lista `businessKey` como parâmetro opcional de `GET /failed-jobs`; um teste com `fetch` simulado confirmou que o SDK serializa `processInstanceId=instance-1&businessKey=business-123&page=0&size=25` no URL. Resposta real do backend pendente.
- AC-12 — PASS (estático) — `/failed-jobs` reutiliza `FiltersSection` e `AppliedFiltersSection` de `/process-instances`. Os campos editam apenas valores de rascunho; “Mostrar resultados” aplica-os, “Limpar filtros” limpa ambos, e cada chip remove apenas o parâmetro correspondente. Todas as alterações aplicadas repõem `pageIndex=0`. Inspeção visual autenticada pendente.
- AC-13 — PASS (estático/Zod) — `processInstanceIdSchema` usa Zod para aceitar vazio ou UUID após `trim`; a aplicação inválida mostra a mesma mensagem em `igrpToast` e na prop `error` de `IGRPInputText`, retorna `false` antes de atualizar filtros, e `FiltersSection` mantém o popover aberto. Editar ou limpar o campo remove o erro inline. Um teste direto com o Zod instalado aceitou vazio, espaços e o UUID da instância fornecida, rejeitando `invalid` com “Introduza um UUID válido.”. Fluxo visual autenticado pendente.
- AC-14 — PASS (estático) — a falha de `getFailedJobs` mostra `igrpToast` de erro, limpa linhas e totais e mantém `loadError` apenas para ocultar dados/paginação antigos; a página não renderiza um alerta de erro. Confirmação visual com falha real da API pendente.

Evidência técnica: em 28 de outubro de 2026, `pnpm exec tsc --noEmit` e `pnpm exec biome check 'src/app/(myapp)/client/failed-jobs.ts'` passaram. Após adotar o popover de filtros e a validação do UUID, `pnpm exec tsc --noEmit`, `pnpm exec biome check 'src/app/(myapp)/components/filter-section.tsx'`, `git diff --check` e `codegraph affected` passaram; não foram identificados testes automatizados afetados. O ficheiro de rota é excluído do Biome por ser gerado, mas foi abrangido pelo TypeScript. `codegraph callers getFailedJobs` confirmou o consumidor da página de detalhe; a assinatura mantém os argumentos antigos opcionais com os valores predefinidos (`page=0`, `size=100`). O SDK instalado beta.27 tipa diretamente `processInstanceId`, `businessKey`, `page` e `size` em `FailedJobQuery` para `GET /failed-jobs`; o wrapper usa esse tipo sem extensão local.

Validação operacional: PENDENTE — esta verificação não dispõe de uma sessão autenticada e de jobs falhados no ambiente API; confirmar manualmente ambos os filtros, os toasts de validação/erro, as páginas, os totais, a stack trace e o reprocessamento antes de promoção.
