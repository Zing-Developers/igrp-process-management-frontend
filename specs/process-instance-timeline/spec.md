# Linha do tempo da instância de processo

## Objetivo

Apresentar a aba “Linha do Tempo de Eventos” como a tabela de atividades do desenho de referência, incluindo o estado e os detalhes operacionais dos jobs falhados.

## Âmbito

Incluído:

- Tabela ordenada das atividades da instância com atividade, tipo, estado, início e responsável.
- Associação dos jobs falhados da instância à respetiva atividade, com destaque, mensagem e metadados de falha.
- Contador derivado de atividades com job falhado e ações para ver o erro e reprocessar quando o `jobId` está disponível.
- Reutilização da mesma gaveta de erro e modal de reprocessamento usados em `/failed-jobs`.

Excluído:

- Alterar o cabeçalho geral da página ou os separadores que não são a linha do tempo.
- Paginação de atividades ou jobs.

## Requisitos funcionais

- **FR-01:** A aba apresenta uma tabela com as atividades de `GET /activities/progress` ordenadas por `treeNumber`.
- **FR-02:** Cada atividade mostra nome/chave, tipo, estado, hora de início e responsável, usando os valores API disponíveis. Na ausência de um responsável atribuído à atividade, a coluna usa `lastReprocessedBy` do job falhado correspondente quando presente.
- **FR-03:** A página obtém os jobs por `GET /failed-jobs?processInstanceId=…` e associa cada job à sua atividade por identificador de atividade/job.
- **FR-04:** Uma atividade em estado falhado com dados de falha é visualmente destacada e apresenta a mensagem, tentativas e datas de falha da API, além das ações “Ver erro” e “Reprocessar…”.
- **FR-05:** As ações usam o `jobId` da API para consultar a stack trace e reprocessar; após reprocessamento bem-sucedido, a informação é atualizada.
- **FR-06:** A linha do tempo e `/failed-jobs` usam o mesmo componente para a gaveta de erro e o modal de reprocessamento, preservando a mesma apresentação, cópia do ID, validação e comportamento.
- **FR-07:** O detalhe operacional usa `reprocessCount` e `lastReprocessedAt` da atividade, complementados pelos valores do job falhado e por `lastReprocessedBy` quando disponíveis. A linha mostra apenas os detalhes úteis ao utilizador, sem JSON de diagnóstico.
- **FR-08:** O estado atual da atividade determina se o erro continua ativo. Quando a API devolve um estado explícito diferente de falha, a linha deixa de mostrar o destaque, o detalhe do erro e as ações de erro/reprocessamento, mesmo que ainda existam dados antigos do job falhado ou da última falha. Sem estado da atividade, os dados de falha disponíveis continuam a servir de fallback.
- **FR-09:** A aba disponibiliza uma ação “Atualizar” para voltar a obter da API a versão atual da instância de processo, o progresso das atividades e os jobs falhados, atualizando a página sem navegação. Enquanto a atualização está pendente, a ação indica esse estado e não permite pedidos duplicados.
- **FR-10:** O aviso de atividades paradas usa o componente Alert no estilo destrutivo do design system shadcn; os estados das atividades usam o componente Badge e as suas variantes sem contornos ou cores hexadecimais definidos manualmente.

## Critérios de aceitação

- **AC-01 (FR-01):** A aba deixa de apresentar a linha do tempo vertical e dados de depuração, mostrando a tabela de atividades.
- **AC-02 (FR-02):** Os valores apresentados em cada coluna derivam de `ActivityProgress`; na coluna “Responsável”, os campos de atribuição da atividade têm prioridade, seguidos de `FailedJob.lastReprocessedBy` do job correspondente, e “—” apenas quando nenhum tem valor.
- **AC-03 (FR-03):** Apenas atividades correspondentes a jobs devolvidos para a instância recebem dados de falha.
- **AC-04 (FR-04):** Linhas em estado falhado com dados de falha incluem o detalhe operacional e as duas ações do desenho; atividades sem falha ativa não incluem esse detalhe.
- **AC-05 (FR-05):** “Ver erro” apresenta a stack trace quando disponível e “Reprocessar…” chama a API e atualiza a tabela após sucesso.
- **AC-06 (FR-06):** Abrir uma ação em qualquer uma das duas páginas mostra a mesma gaveta/modal partilhada; não existem implementações duplicadas desses fluxos.
- **AC-07 (FR-07):** A linha de detalhe e a gaveta partilhada mostram metadados de reprocessamento quando presentes; contagem zero sem data ou utilizador não acrescenta texto à linha. A linha não apresenta objetos da API serializados em JSON nem texto de diagnóstico.
- **AC-08 (FR-08):** Depois de um reprocessamento, se a atividade passar de `FAILED` para `REPROCESSING`, `RETRYING`, `COMPLETED` ou outro estado não falhado, a tabela mostra esse novo estado sem pré-visualização do erro, ações de erro/reprocessamento ou contagem de atividade parada; enquanto o estado continuar `FAILED`, mantém o detalhe de falha.
- **AC-09 (FR-09):** Ao selecionar “Atualizar” na linha do tempo, a página refaz as consultas da instância, atividades e jobs falhados e apresenta os novos valores devolvidos; durante o pedido, o botão fica desativado e mostra o estado de atualização.
- **AC-10 (FR-10):** Havendo atividades paradas, o aviso é um Alert destrutivo com título e descrição; cada estado aparece num Badge do design system: falha destrutivo, atividade em curso padrão, reprocessamento/tentativa e conclusão secundários, e estados pendentes/desconhecidos em contorno. Texto e visibilidade continuam a seguir os estados da API.
