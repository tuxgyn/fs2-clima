#Projeto clima

Este projeto vai pegar a cidade e baseado nisso, consultar o clima daquela região, exibindos as principais informações de clima, temperatura, humidade e etc.
###Aspectos Técnicos

O projeto vai ser feito em Vite + Vanilla + Tyscript

Ele vai usar API OpenMeteo, com os seguintes endpoints:

Para pegar a latitude e logitude e time zone, baseado no nome da cidade:

https://geocoding-api.open-meteo.com/v1/search?name={NOME_DA_CIDADE}Goi%C3%A2nia&count=1&language=pt&format=json

Para pegar as informações de clima:
https://api.open-meteo.com/v1/forecast?latitude={LATIDUDE}&longitude={LOGITUDE}&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m&timezone={TIMEZONE}
