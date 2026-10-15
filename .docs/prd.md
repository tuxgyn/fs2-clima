# PRD - Aplicativo de Clima

## 1. Visão geral

Este produto é uma aplicação web de consulta de clima por cidade, desenvolvida em Vite + Vanilla + TypeScript. O objetivo principal é permitir que o usuário informe o nome de uma cidade, o sistema busque essa localização e retorne as condições climáticas principais em uma interface clara, legível e responsiva.

A aplicação deve funcionar como uma experiência simples e direta, com uma busca única para o usuário, mesmo que internamente execute duas requisições para a API: uma para localizar a cidade e outra para buscar o clima.

## 2. Objetivo do produto

O produto deve:

- Buscar informações climáticas por cidade;
- Exibir dados principais do clima atual;
- Tratar estados de carregamento e ausência de resultados;
- Permitir uma interface visual limpa e moderna;
- Garantir que a aplicação seja funcional mesmo quando a API falhar ou não encontrar uma cidade.

## 3. Personas e usuários

### Usuário principal
- Pessoa que deseja saber rapidamente o clima de uma cidade.
- Busca uma interface simples, sem etapas complexas.
- Prefere uma resposta visual direta e legível em poucos segundos.

### Cenários de uso
- Consultar o clima de uma cidade específica;
- Ver informações como temperatura, umidade, sensação térmica e vento;
- Entender se está de dia ou de noite;
- Identificar o estado do tempo por meio de código e descrição textual.

## 4. Funcionalidades principais

### 4.1 Busca por cidade
- O usuário informa o nome da cidade em um campo de busca;
- A aplicação valida se o valor foi informado;
- A aplicação realiza a busca geográfica via API do Open-Meteo;
- Caso a cidade não seja encontrada, a interface deve mostrar estado vazio ou mensagem de não encontrado.

### 4.2 Consulta do clima
- Após obter latitude, longitude e timezone da cidade, a aplicação consulta o clima atual;
- A aplicação coleta as variáveis obrigatórias do retorno:
  - temperatura atual;
  - umidade relativa;
  - temperatura aparente;
  - indicador se é dia ou noite;
  - precipitação;
  - velocidade do vento;
  - direção do vento;
  - código meteorológico.

### 4.3 Estado de carregamento
- Enquanto a busca está em andamento, a interface deve exibir um loading claro e informativo;
- O usuário deve perceber que o sistema está consultando a cidade e o clima.

### 4.4 Estado vazio / sem resultado
- Quando não houver cidade ou quando a API retornar dados vazios/inválidos, a interface deve mostrar um estado vazio elegante;
- A mensagem deve orientar o usuário a tentar outra cidade.

### 4.5 Exibição dos dados meteorológicos
A tela deve apresentar claramente:
- temperatura;
- nome da cidade e código do país;
- data atual;
- indicação de dia/noite;
- descrição do código meteorológico;
- umidade relativa;
- temperatura aparente;
- precipitação;
- velocidade e direção do vento.

## 5. Requisitos funcionais

### RF-01: Entrada de cidade
O sistema deve permitir que o usuário informe uma cidade em um campo de texto.

### RF-02: Validação da entrada
Se o campo estiver vazio, a aplicação deve impedir a busca e apresentar feedback adequado.

### RF-03: Geocodificação
Deve consultar a API do Open-Meteo para encontrar a cidade, obtendo:
- name;
- latitude;
- longitude;
- country_code;
- timezone.

### RF-04: Consulta do clima
Com latitude, longitude e timezone, o sistema deve consultar o clima atual da região.

### RF-05: Tratamento de erros
Se a cidade não for encontrada, a busca falhar ou os dados do clima forem inválidos, a aplicação deve exibir uma mensagem amigável e manter a interface funcional.

### RF-06: Loading
Durante as requisições, a interface deve mostrar estado de carregamento para manter o usuário informado.

### RF-07: Aperfeiçoamento visual da previsão
O sistema deve traduzir o weather_code em uma descrição legível para o usuário, como:
- Clear sky;
- Mainly clear;
- Partly cloudy;
- Overcast;
- Fog;
- Rain;
- Snow;
- Thunderstorm.

### RF-08: Exibição do clima
Os principais dados climáticos devem ser expostos em um layout visual que prioriza leitura rápida e clareza.

## 6. Requisitos de sistema

### 6.1 Stack tecnológica
- Vite
- TypeScript
- JavaScript vanilla
- HTML
- CSS

### 6.2 Integração com APIs
A aplicação deve acessar a API Open-Meteo por meio de funções encapsuladas em um arquivo dedicado de serviços, e não fazer chamadas diretas no código da interface.

### 6.3 Arquitetura de serviço
O projeto deve seguir esta lógica:
1. Pegar o nome da cidade digitada;
2. Buscar geolocalização (latitude, longitude, timezone);
3. Buscar o clima com base nos dados geográficos;
4. Validar o retorno;
5. Montar a resposta para a UI;
6. Tratar erro de forma padronizada.

### 6.4 Requisições esperadas
Cada busca de cidade deve realizar duas chamadas:
- geocoding;
- forecast.

Internamente, isso deve parecer ao usuário como uma única ação de busca.

### 6.5 Validação de parâmetros
As funções de API devem verificar se os parâmetros necessários vieram corretamente. Caso contrário, devem agir como se a busca não tivesse encontrado resultado.

## 7. Detalhes técnicos

### 7.1 Endpoint de geocodificação
URL base:
https://geocoding-api.open-meteo.com/v1/search?name={NOME_DA_CIDADE}&count=1&language=pt&format=json

Campos importantes do retorno:
- name
- latitude
- longitude
- country_code
- timezone

### 7.2 Endpoint de previsão climática
URL base:
https://api.open-meteo.com/v1/forecast?latitude={LATITUDE}&longitude={LONGITUDE}&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone={TIMEZONE}

Campos importantes do retorno:
- current.temperature_2m
- current.relative_humidity_2m
- current.apparent_temperature
- current.is_day
- current.precipitation
- current.weather_code
- current.wind_speed_10m
- current.wind_direction_10m

### 7.3 Regras de tratamento
- Se o retorno da geocodificação vier vazio, tratar como "cidade não encontrada";
- Se a cidade for encontrada mas o clima não vier, tratar como erro de consulta;
- Se algum dado obrigatório estiver ausente, tratar como falha na renderização dos dados;
- Não bloquear a interface por exceções não tratadas.

### 7.4 Mapeamento do weather_code
A aplicação deve mapear os códigos para descrições legíveis e amigáveis ao usuário. O mapeamento base deve seguir o conjunto abaixo:

- 0: Clear sky
- 1: Mainly clear
- 2: Partly cloudy
- 3: Overcast
- 45: Fog
- 48: Depositing rime fog
- 51: Light drizzle
- 53: Moderate drizzle
- 55: Dense drizzle
- 56: Light freezing drizzle
- 57: Dense freezing drizzle
- 61: Slight rain
- 63: Moderate rain
- 65: Heavy rain
- 66: Light freezing rain
- 67: Heavy freezing rain
- 71: Slight snowfall
- 73: Moderate snowfall
- 75: Heavy snowfall
- 77: Snow grains
- 80: Slight rain showers
- 81: Moderate rain showers
- 82: Violent rain showers
- 85: Slight snow showers
- 86: Heavy snow showers
- 95: Thunderstorm
- 96: Thunderstorm with slight hail
- 97: Heavy thunderstorm
- 99: Thunderstorm with heavy hail

### 7.5 Estrutura lógica sugerida
A arquitetura pode ser organizada em:
- UI principal;
- módulo de busca de cidade;
- módulo de clima;
- utilitários de mapeamento de dados;
- utilitários de validação;
- camada de tratamento de erro.

## 8. Critérios de aceite

### CA-01: Busca bem-sucedida
Quando o usuário digita uma cidade válida, o sistema deve exibir os dados climáticos da cidade em até alguns segundos.

### CA-02: Cidade inexistente
Quando a cidade não existe, a aplicação deve mostrar estado vazio ou mensagem de resultado não encontrado.

### CA-03: Campo vazio
Quando o usuário tenta buscar sem informar cidade, deve haver bloqueio da ação e feedback visual.

### CA-04: Carregamento
Durante a requisição, a interface deve indicar que os dados estão sendo carregados.

### CA-05: Dados incompletos
Se a API retornar campos incompletos, a aplicação deve exibir erro amigável sem quebrar a UI.

### CA-06: Visual principal
O layout deve visualizar claramente a organização de sidebar e conteúdo principal, com visual limpo e profissional.

## 9. Instruções visuais e UX

### 9.1 Layout geral
- Fundo escuro em tons de cinza;
- Centralizar o container principal na tela;
- Container principal com bordas arredondadas;
- Largura máxima recomendada: 800px;
- O bloco principal deve ter fundo branco;
- Layout dividido em duas áreas:
  - sidebar à esquerda;
  - área principal à direita.

### 9.2 Sidebar
A sidebar deve conter:
- temperatura principal;
- nome da cidade;
- código do país;
- dia atual;
- indicador de dia/noite;
- descrição do weather_code.

### 9.3 Área principal
A área principal deve exibir:
- umidade relativa;
- temperatura aparente;
- probabilidade de precipitação;
- velocidade do vento;
- direção do vento.

### 9.4 Empty State
- Deve ser visualmente limpo e consistentes com o tema geral;
- Deve indicar claramente que não há dados para mostrar;
- Deve orientar o usuário a tentar outra busca.

### 9.5 Responsividade
O layout deve funcionar em telas menores, mantendo legibilidade e organização sem perder as informações principais.

### 9.6 Consistência visual
- Priorizar legibilidade;
- Usar espaçamento adequado entre blocos;
- Utilizar contraste suficiente para leitura em telas claras;
- Manter a interface centralizada e visualmente equilibrada.

## 10. Resumo executivo

O aplicativo de clima deve funcionar como uma experiência contínua de consulta simples e confiável. O fluxo principal é: usuário digita a cidade, sistema busca a localização, consulta o clima atual e apresenta dados claros em uma interface com layout moderno e responsivo. A aplicação deve tratar erros e dados ausentes com elegância, garantindo uma experiência útil mesmo quando a busca falha ou a API não responde corretamente.

## 11. Observações finais

- O projeto deve manter a lógica de requisições encapsulada em serviços.
- A busca por cidade deve se comportar como uma ação única para o usuário, mesmo sendo composta por duas requisições internas.
- O foco principal é legibilidade, confiabilidade e clareza de informação.
