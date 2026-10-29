# Jobs falhados

## Objetivo

Disponibilizar a rota `/failed-jobs` com a apresentação definida no desenho fornecido, para que um operador reconheça os jobs assíncronos que esgotaram as tentativas.

## Âmbito

Incluído nesta entrega:

- Cabeçalho, descrição, filtros por UUID da instância e business key, e contador total de resultados.
- Tabela responsiva com processo, tarefa, erro, tentativas, última falha e ações.
- Consulta a `GET /failed-jobs`, com filtros opcionais `processInstanceId` e `businessKey` e paginação pelo servidor (`page`, `size`).
- Estados vazios, drawer de detalhe do erro e modal de confirmação de reprocessamento.
- Consulta da stack trace em `GET /failed-jobs/{jobId}/stacktrace` quando o operador abre o drawer.
- Reprocessamento em `POST /failed-jobs/{jobId}/retry`, com contagem de tentativas opcional, e atualização da lista após sucesso.

Excluído nesta entrega:

- Autorização `FAILED_JOBS:*`.
- Navegação para o detalhe da instância.

## Requisitos funcionais

- **FR-01:** A rota `/failed-jobs` apresenta o título “Jobs falhados” e a explicação do estado dos jobs.
- **FR-02:** A página mostra os jobs devolvidos por `GET /failed-jobs` e os campos disponíveis no contrato.
- **FR-03:** O operador pode filtrar os jobs pelo UUID da instância e aplicar o filtro através de “Mostrar resultados”; aplicar ou remover o filtro regressa à primeira página.
- **FR-04:** A página apresenta o total de registos devolvido pela API e um estado vazio quando o filtro não encontra resultados.
- **FR-10:** O operador pode navegar entre páginas de jobs falhados com “Anterior” e “Seguinte”. Cada navegação consulta `GET /failed-jobs` com o índice de página e tamanho configurado; os controlos mostram a página atual e desativam-se nos limites.
- **FR-11:** O operador pode filtrar pela business key da instância, isoladamente ou em conjunto com o UUID; aplicar ou limpar o filtro regressa à primeira página, e valores vazios não são enviados.
- **FR-12:** Os filtros de `/failed-jobs` seguem a experiência de `/process-instances`: botão “Filtros” abre um popover com os campos, ações “Mostrar resultados” e “Limpar filtros”, e filtros aplicados aparecem como chips removíveis. Apenas filtros aplicados afetam a consulta.
- **FR-13:** O campo opcional “Instância de processo” aceita vazio ou um UUID válido. Ao tentar aplicar um valor inválido, a página mostra um toast e uma mensagem de validação por baixo do campo, mantém o popover aberto e não altera os filtros aplicados nem consulta a API.
- **FR-14:** Se a consulta dos jobs falhados falhar, a página mostra um toast de erro em vez de um alerta no corpo da página.
- **FR-05:** Ao selecionar “Ver erro”, a página abre um drawer à direita com os dados do job selecionado: identificador, tarefa, processo, estado, tentativas, datas de falha, mensagem e stack trace. A stack trace pode ser copiada.
- **FR-07:** Ao selecionar “Reprocessar…”, a página abre um modal de confirmação com o último erro, o total de tentativas, o aviso operacional e um campo opcional de tentativas para o novo reprocessamento.
- **FR-08:** O campo de tentativas no modal aceita vazio (valor do servidor) ou um inteiro entre 1 e 100; a confirmação chama `POST /failed-jobs/{jobId}/retry`.
- **FR-09:** Ao abrir o drawer, a página obtém a stack trace do job selecionado em `GET /failed-jobs/{jobId}/stacktrace`.
- **FR-06:** O cabeçalho e a tabela reutilizam `PageHeader` e `IGRPDataTable`, os mesmos componentes da página `process-instances`.

## Critérios de aceitação

- **AC-01 (FR-01):** Ao abrir `/failed-jobs`, o cabeçalho e a descrição correspondem ao desenho fornecido.
- **AC-02 (FR-02):** Cada linha apresenta os dados devolvidos pela API: processo, tarefa, mensagem/estado de tentativa, última falha e as duas ações.
- **AC-03 (FR-03):** Ao aplicar um UUID existente, a consulta inclui esse UUID e começa em `page=0`; ao remover o chip ou limpar os filtros, a consulta omite o UUID e volta a `page=0`.
- **AC-04 (FR-04):** O contador reflete `totalElements` da API, mesmo quando há mais de uma página, e a tabela mostra uma mensagem compreensível quando não existem resultados.
- **AC-05 (FR-05):** “Ver erro” abre um painel lateral direito com o conteúdo do job da linha selecionada; o painel fecha pelo ícone ou botão “Fechar”, e “Copiar” copia a stack trace.
- **AC-06 (FR-06):** O código da rota importa e utiliza `PageHeader` e `IGRPDataTable`.
- **AC-07 (FR-07):** “Reprocessar…” abre um modal com dados do job selecionado e ações “Cancelar” e “Reprocessar”.
- **AC-08 (FR-08):** Um valor inválido mostra erro de validação; vazio ou um inteiro entre 1 e 100 chama a API de reprocessamento e, em caso de sucesso, atualiza a lista.
- **AC-09 (FR-09):** “Ver erro” obtém e apresenta a stack trace do job selecionado, incluindo os estados de carregamento e falha.
- **AC-10 (FR-10):** “Seguinte” e “Anterior” pedem as páginas adjacentes ao servidor; o indicador apresenta a página atual e `totalPages`, os botões ficam desativados na primeira/última página, e uma página que fique vazia após reprocessamento recua para a última página válida.
- **AC-11 (FR-11):** Ao aplicar uma business key, a consulta `GET /failed-jobs` inclui `businessKey` e começa em `page=0`; o UUID também é enviado se preenchido. Ao limpar a business key e filtrar, o parâmetro é omitido e a página volta a `page=0`.
- **AC-12 (FR-12):** O botão “Filtros” abre o mesmo componente de popover usado em `/process-instances`; alterações nos campos só afetam a consulta após “Mostrar resultados”. “Limpar filtros” remove ambos os filtros e volta à primeira página; cada chip remove apenas o respetivo filtro, atualiza a consulta e volta à primeira página.
- **AC-13 (FR-13):** “Mostrar resultados” com UUID malformado não fecha o popover, não envia nova consulta e apresenta um toast de erro e “Introduza um UUID válido.” por baixo do campo. UUID válido ou campo vazio passa na validação Zod e permite aplicar; editar ou limpar o campo remove a mensagem inline.
- **AC-14 (FR-14):** Quando `GET /failed-jobs` falha, o erro é apresentado num toast e não num alerta dentro da página; o estado de erro continua a impedir a apresentação de dados/paginação desatualizados.
