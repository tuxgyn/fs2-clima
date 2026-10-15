# Tasks - Implementação do PRD

> Fonte principal de requisitos: [.docs/prd.md](./prd.md)
>
> Este documento não repete todas as regras do PRD; ele organiza a implementação em blocos pequenos e progressivos. Cada tarefa deve ser executada por um agente de IA individualmente, com foco em um subconjunto do projeto e validada contra os critérios de aprovação definidos aqui.
>
> Fluxo recomendado:
> 1. Escolher a próxima tarefa pendente.
> 2. Implementar somente aquilo necessário para cumprir essa tarefa.
> 3. Validar o critério de aprovação.
> 4. Marcar a tarefa como concluída.
> 5. Avançar para a próxima tarefa sem reabrir requisitos já definidos no PRD.

## 1. Setup inicial do projeto

- [x] Configurar a estrutura base do projeto Vite + TypeScript sem arquivos de template desnecessários.
  - Critério de aprovação: o projeto roda com `npm install` e `npm run build` sem erros de configuração.

- [x] Remover código inicial do Vite e preparar a base da aplicação para o clima.
  - Critério de aprovação: os arquivos padrão do template não estão mais sendo usados na interface inicial e o projeto está pronto para receber a tela do clima.

## 2. Estrutura da aplicação

- [x] Criar a estrutura principal da UI com container central, sidebar e área principal.
  - Critério de aprovação: a aplicação possui um layout com dois blocos principais visíveis e centralizados em uma área com fundo escuro e painel branco.

- [x] Definir a estrutura HTML/TS para a tela de clima e os estados de loading e empty state.
  - Critério de aprovação: existem containers para busca, status de carregamento, erro/empty state e dados meteorológicos.

## 3. Busca por cidade

- [x] Implementar o campo de busca para inserir o nome da cidade.
  - Critério de aprovação: existe um input de texto funcional e acessível para receber a cidade.

- [x] Validar entrada vazia antes da busca.
  - Critério de aprovação: ao tentar buscar com campo vazio, a ação é bloqueada e o usuário recebe feedback visual ou textual claro.

- [x] Criar serviço para consultar a API de geocodificação do Open-Meteo.
  - Critério de aprovação: a função faz requisição para a rota de geocodificação e retorna os dados necessários: nome, latitude, longitude, country_code e timezone.

- [x] Tratar ausência de resultado da geocodificação.
  - Critério de aprovação: quando a cidade não existe, a aplicação exibe estado vazio ou mensagem de "cidade não encontrada" sem quebrar a UI.

## 4. Consulta do clima

- [x] Criar serviço para consultar a API de previsão do Open-Meteo usando latitude, longitude e timezone.
  - Critério de aprovação: a função faz a requisição correta com os parâmetros esperados e retorna os dados principais do clima atual.

- [x] Validar os dados retornados antes de renderizar.
  - Critério de aprovação: se alguma propriedade essencial estiver ausente, a aplicação trata como erro e não renderiza dados quebrados.

- [x] Implementar o mapeamento do weather_code para texto legível.
  - Critério de aprovação: cada código meteorológico é convertido em uma descrição clara para o usuário, como "Clear sky", "Partly cloudy" ou "Thunderstorm".

## 5. Renderização dos dados na interface

- [x] Exibir temperatura principal na sidebar.
  - Critério de aprovação: a interface mostra a temperatura atual da cidade em destaque.

- [x] Exibir nome da cidade, código do país e data atual.
  - Critério de aprovação: os dados de localização e dia atual aparecem corretamente no painel lateral.

- [x] Exibir se é dia ou noite e a descrição do clima.
  - Critério de aprovação: a interface mostra o status de dia/noite e a descrição associada ao weather_code.

- [x] Exibir umidade relativa, temperatura aparente, precipitação e vento na área principal.
  - Critério de aprovação: os valores principais do clima são apresentados em blocos claros e legíveis na área de conteúdo.

## 6. Estados da aplicação

- [ ] Implementar estado de carregamento durante a busca.
  - Critério de aprovação: enquanto a aplicação está consultando a API, o usuário vê um indicador visual claro de carregamento.

- [ ] Implementar empty state para ausência de dados ou cidade não encontrada.
  - Critério de aprovação: a tela mostra um estado vazio com mensagem orientativa e aparência consistente com o design.

- [ ] Implementar tratamento de erro para falhas de rede ou respostas inválidas.
  - Critério de aprovação: erros de API não quebram a interface; o usuário recebe feedback útil e a aplicação permanece funcional.

## 7. Visual e UX

- [x] Aplicar tema escuro de fundo e painel branco centralizado.
  - Critério de aprovação: o visual geral segue a proposta do PRD, com fundo cinza escuro e container principal em branco, centralizado.

- [x] Definir espaçamento, bordas e proporções do layout para manter legibilidade.
  - Critério de aprovação: o layout é visualmente equilibrado, com espaçamento adequado e sem sobreposição de informações.

- [x] Tornar a interface responsiva para telas menores.
  - Critério de aprovação: em dispositivos menores, a interface mantém organização e legibilidade sem quebrar o layout.

## 8. Qualidade e validação

- [ ] Rodar verificação de build com TypeScript.
  - Critério de aprovação: `npm run build` executa com sucesso sem erros de compilação.

- [ ] Validar que a aplicação funciona com fluxo principal de busca bem-sucedida.
  - Critério de aprovação: ao informar uma cidade válida, a tela exibe os dados climáticos corretamente.

- [ ] Validar que o fluxo de erro é funcional.
  - Critério de aprovação: cidade inexistente, campo vazio e falha na API geram comportamento esperado e sem quebra visual.

## 9. Revisão final

- [ ] Revisar alinhamento com o PRD original.
  - Critério de aprovação: todas as principais funcionalidades, requisitos e instruções visuais do PRD foram cobertas na implementação.

- [ ] Realizar revisão final de acessibilidade e legibilidade.
  - Critério de aprovação: textos, contraste e organização visual atendem ao nível mínimo de clareza e usabilidade esperado para o produto.
