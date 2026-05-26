# Casos de Teste - Velô Sprint (Configurador de Veículo Elétrico)

***

## Módulo: Landing Page

### CT01 - Landing Page: Acesso e redirecionamento para o configurador

#### Objetivo

Validar se a Landing Page é carregada corretamente e permite ao usuário acessar o configurador de veículos de forma fluida.

#### Pré-Condições

- O sistema deve estar acessível e online.

#### Passos

| Id | Ação                                                              | Resultado Esperado                                                                      |
| -- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1  | Acessar a URL raiz do sistema                                     | Landing Page é carregada com a marca Velô e destaques do Velô Sprint                    |
| 2  | Clicar no botão para configurar o veículo (ex: "Configure Agora") | O sistema redireciona o usuário para a página de Configurador de Veículo (`/configure`) |

#### Resultados Esperados

- A página inicial exibida corretamente sem erros e a navegação direciona para a rota `/configure`.

#### Critérios de Aceitação

- Título principal e informações do veículo devem estar visíveis.
- O clique no botão de navegação altera a URL e renderiza o Configurador.

***

## Módulo: Configurador de Veículo

### CT02 - Configurador: Adição e remoção de opcionais e cálculo do preço total

#### Objetivo

Validar se o preço total do veículo é atualizado dinamicamente aplicando os valores corretos ao selecionar e remover opcionais e rodas.

#### Pré-Condições

- Estar na página do Configurador de Veículo (`/configure`).
- Preço base do carro padrão configurado para R$ 40.000.

#### Passos

| Id | Ação                                                                     | Resultado Esperado                                |
| -- | ------------------------------------------------------------------------ | ------------------------------------------------- |
| 1  | Visualizar o preço inicial (Resumo)                                      | Preço exibido é R$ 40.000,00                      |
| 2  | Selecionar "Sport Wheels" na aba de Rodas                                | Preço é atualizado para R$ 42.000,00 (+ R$ 2.000) |
| 3  | Selecionar o opcional "Precision Park"                                   | Preço é atualizado para R$ 47.500,00 (+ R$ 5.500) |
| 4  | Selecionar o opcional "Flux Capacitor"                                   | Preço é atualizado para R$ 52.500,00 (+ R$ 5.000) |
| 5  | Desmarcar "Sport Wheels" (voltar para Aero) e desmarcar "Precision Park" | Preço é atualizado para R$ 45.000,00              |

#### Resultados Esperados

- O sistema atualiza o valor total em tempo real com base na seleção ou remoção dos itens.

#### Critérios de Aceitação

- O somatório obedece aos valores: Base 40k, Sport 2k, Park 5.5k, Flux 5k.
- O resumo exibe a lista exata dos itens selecionados.

***

## Módulo: Checkout e Financiamento

### CT03 - Checkout: Cálculo de Simulação de financiamento (12x, juros 2% a.m.)

#### Objetivo

Validar o cálculo de financiamento, que deve ser travado em 12 parcelas com uma taxa de 2% ao mês sobre o valor financiado.

#### Pré-Condições

- Veículo base configurado (Total R$ 40.000).
- Estar na página de Checkout (`/order`).

#### Passos

| Id | Ação                                                 | Resultado Esperado                                                                                                     |
| -- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 1  | Selecionar a forma de pagamento "Financiamento"      | Campo "Valor da Entrada" e resumo do financiamento são habilitados                                                     |
| 2  | Inserir "10000" no campo "Valor da Entrada"          | Valor a financiar passa a ser R$ 30.000,00                                                                             |
| 3  | Observar o quadro de resumo do parcelamento          | O sistema exibe o valor da parcela baseado na taxa de 2% a.m. (12x de R$ 2.550,00) e o Total financiado (R$ 30.600,00) |
| 4  | Observar o "Total" geral do pedido no resumo lateral | O "Total" é atualizado para a soma da Entrada + Total financiado (R$ 40.600,00)                                        |

#### Resultados Esperados

- Os cálculos e valores apresentados nas parcelas e totais devem refletir com precisão a aplicação de juros sobre o saldo devedor.

#### Critérios de Aceitação

- Quantidade de parcelas deve ser obrigatoriamente 12.
- Taxa informada e aplicada deve ser 2% a.m.
- O total geral reflete o custo real da compra parcelada.

***

### CT04 - Checkout: Validação de campos obrigatórios e formatos inválidos

#### Objetivo

Garantir que o sistema impeça a submissão do pedido se houver dados obrigatórios em branco, formatos incorretos, ou termos de uso não aceitos.

#### Pré-Condições

- Estar na etapa de Checkout/Pedido (`/order`).

#### Passos

| Id | Ação                                                                               | Resultado Esperado                                                                        |
| -- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1  | Clicar no botão "Confirmar Pedido" sem preencher nada                              | Sistema exibe mensagens de erro em todos os campos obrigatórios e no aceite de termos     |
| 2  | Preencher Nome "A", Sobrenome "B", Email "teste"                                   | Erros específicos são exibidos: "Nome deve ter pelo menos 2 caracteres", "Email inválido" |
| 3  | Preencher Telefone "(11) 9" e CPF "123.456" (incompletos)                          | Erros de "Telefone inválido" e "CPF inválido" são exibidos                                |
| 4  | Corrigir todos os dados, selecionar a loja, mas não marcar "Li e aceito os Termos" | Mensagem de erro informando para aceitar os termos é exibida sob o checkbox               |

#### Resultados Esperados

- A requisição do pedido não é submetida. Alertas de validação precisos são renderizados próximos a cada campo problemático.

#### Critérios de Aceitação

- Campos nome/sobrenome exigem min 2 caracteres.
- Email exige formato válido.
- Telefone e CPF exigem máscara/tamanho completo (14 caracteres formatados).
- Loja deve estar selecionada.
- Aceite dos Termos de Uso é obrigatório.

***

## Módulo: Análise de Crédito Automática

### CT05 - Análise de Crédito: Aprovação automática por Score (> 700)

#### Objetivo

Validar o fluxo bem-sucedido de compra financiada para clientes com score de crédito considerado alto.

#### Pré-Condições

- Dados do Checkout preenchidos de forma válida.
- Forma de pagamento: Financiamento com entrada inferior a 50% do total.
- A API de análise de crédito retornará um Score de 750 para o CPF preenchido.

#### Passos

| Id | Ação                                                       | Resultado Esperado                           |
| -- | ---------------------------------------------------------- | -------------------------------------------- |
| 1  | Preencher formulário válido e clicar em "Confirmar Pedido" | Botão entra em estado de "Processando..."    |
| 2  | Aguardar o retorno da API e processamento                  | Sistema redireciona para a página de Sucesso |
| 3  | Verificar o Status do Pedido na tela de Confirmação        | O pedido é exibido com o status "APROVADO"   |

#### Resultados Esperados

- Pedido criado com sucesso e o cliente é notificado sobre a aprovação automática de seu crédito.

#### Critérios de Aceitação

- Regra do score > 700 define o status como "APROVADO".

***

### CT06 - Análise de Crédito: Em Análise (Score 501 a 700)

#### Objetivo

Validar que um pedido passa para o status de análise manual quando o cliente apresenta um score mediano.

#### Pré-Condições

- Dados do Checkout preenchidos de forma válida.
- Forma de pagamento: Financiamento com entrada inferior a 50%.
- A API de análise de crédito retornará um Score de 600.

#### Passos

| Id | Ação                                                | Resultado Esperado                            |
| -- | --------------------------------------------------- | --------------------------------------------- |
| 1  | Clicar em "Confirmar Pedido"                        | Sistema submete os dados                      |
| 2  | Aguardar o redirecionamento                         | Usuário é levado para a tela de Sucesso       |
| 3  | Verificar o Status do Pedido na tela de Confirmação | O pedido é exibido com o status "EM\_ANALISE" |

#### Resultados Esperados

- Pedido gerado com sucesso, porém o cliente é alertado que o crédito está passando por revisão.

#### Critérios de Aceitação

- Regra do score entre 501 e 700 define o status como "EM\_ANALISE".

***

### CT07 - Análise de Crédito: Reprovação (Score <= 500)

#### Objetivo

Validar a recusa de financiamento para clientes que apresentam score de crédito baixo.

#### Pré-Condições

- Dados do Checkout preenchidos de forma válida.
- Forma de pagamento: Financiamento com entrada inferior a 50%.
- A API de análise de crédito retornará um Score de 450.

#### Passos

| Id | Ação                                                | Resultado Esperado                          |
| -- | --------------------------------------------------- | ------------------------------------------- |
| 1  | Clicar em "Confirmar Pedido"                        | Sistema processa a requisição               |
| 2  | Aguardar o redirecionamento                         | Usuário é levado para a tela de Sucesso     |
| 3  | Verificar o Status do Pedido na tela de Confirmação | O pedido é exibido com o status "REPROVADO" |

#### Resultados Esperados

- O pedido é registrado, mas com status reprovado. O cliente recebe informação clara de que seu financiamento não foi aprovado.

#### Critérios de Aceitação

- Regra do score <= 500 define o status como "REPROVADO".

***

### CT08 - Análise de Crédito: Exceção de Aprovação (Entrada >= 50%)

#### Objetivo

Validar a regra de negócio que aprova o crédito independentemente do score baixo, caso o valor de entrada seja igual ou maior que 50% do valor total.

#### Pré-Condições

- Dados do Checkout preenchidos de forma válida.
- Valor total do veículo (ex: R$ 40.000).
- A API de análise retornará um Score de 300 (que normalmente causaria reprovação).

#### Passos

| Id | Ação                                                                                | Resultado Esperado                                                        |
| -- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1  | Selecionar "Financiamento" e preencher Valor de Entrada com R$ 20.000 (50%) ou mais | Sistema exibe o novo valor de financiamento                               |
| 2  | Clicar em "Confirmar Pedido"                                                        | Sistema processa o pedido                                                 |
| 3  | Aguardar o redirecionamento                                                         | Usuário é levado para a tela de Sucesso e o pedido consta como "APROVADO" |

#### Resultados Esperados

- A regra de 50% de entrada tem prioridade máxima. O pedido é aprovado ignorando o score negativo.

#### Critérios de Aceitação

- Ocorre sobreposição de regra (Entrada >= 50% + Score < 700 = APROVADO).

***

## Módulo: Confirmação e Consulta de Pedidos

### CT09 - Consulta de Pedidos: Fluxo com Sucesso (Busca por pedido válido)

#### Objetivo

Garantir que um cliente consiga consultar todos os detalhes da compra inserindo o número do pedido correto.

#### Pré-Condições

- Ter realizado um pedido previamente e possuir seu código identificador (`order_number` / ID).
- Estar na página de Consulta (`/lookup`).

#### Passos

| Id | Ação                                                | Resultado Esperado                                                                                                          |
| -- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1  | Inserir o número do pedido válido no campo de busca | O campo de busca é preenchido                                                                                               |
| 2  | Clicar no botão "Buscar Pedido"                     | O sistema entra em estado de carregamento                                                                                   |
| 3  | Analisar o resultado exibido em tela                | O sistema retorna o painel com as informações: Status, Configurações do Carro, Dados do Cliente, Data do Pedido e Pagamento |

#### Resultados Esperados

- Todos os detalhes (Cor, Rodas, Status, Valor, etc) devem corresponder exatamente ao que foi salvo no momento do Checkout.

#### Critérios de Aceitação

- Os dados do pedido consultado são exibidos de forma clara e legível.

***

### CT10 - Consulta de Pedidos: Número inválido ou inexistente

#### Objetivo

Validar o tratamento do sistema quando o usuário busca por um pedido que não existe no banco de dados.

#### Pré-Condições

- Estar na página de Consulta (`/lookup`).

#### Passos

| Id | Ação                                                    | Resultado Esperado                                                                             |
| -- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 1  | Inserir um identificador inexistente (ex: "VLO-000000") | O campo é preenchido                                                                           |
| 2  | Clicar em "Buscar Pedido"                               | O sistema processa a busca                                                                     |
| 3  | Visualizar o feedback na tela                           | Um card de erro é exibido informando "Pedido não encontrado" e orientando a verificar o número |

#### Resultados Esperados

- O sistema comunica elegantemente a falha na busca sem apresentar erros técnicos ou estourar exceções em tela.

#### Critérios de Aceitação

- Nenhuma informação sensível é exibida.
- Feedback visual sobre a ausência do registro ("Pedido não encontrado") deve ser claro.

***

### CT11 - Consulta de Pedidos: Validação do botão de busca (Campo vazio)

#### Objetivo

Garantir que não seja possível realizar requisições desnecessárias com o campo de busca em branco.

#### Pré-Condições

- Estar na página de Consulta (`/lookup`).

#### Passos

| Id | Ação                                                       | Resultado Esperado                                                          |
| -- | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1  | Deixar o campo de número do pedido completamente em branco | O campo está vazio                                                          |
| 2  | Tentar clicar no botão "Buscar Pedido"                     | O botão se encontra desabilitado (disabled) e não aciona nenhuma requisição |

#### Resultados Esperados

- O sistema não permite envio de strings vazias para a API de busca.

#### Critérios de Aceitação

- O botão `Buscar Pedido` fica em estado inativo enquanto o campo correspondente não contiver nenhum texto.

