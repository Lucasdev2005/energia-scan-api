# energia-scan-api

Projeto back end com foco em extrair dados de uma fatura de energia e disponibilizar graficos e listagens.

## Tecnólogias utilizadas
<div align="center">
    <img width="80" height="80" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" />
    <img width="80" height="80" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prisma/prisma-original-wordmark.svg" />
    <img width="60" height="60" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg" />
</div>

## Compilando localmente
 1) Configure as variáveis de ambiente do projeto.
 2) Tenha instalado uma versão 18.x do NodeJS em sua máquina.
 3) Tenha um banco postgres em sua máquina.
 4) Rode ```npx prisma migrate dev```
 5) Rode ```npm install```
 6) Rode ```npm run dev```

## Variáveis de ambiente
```PORT``` é a várivel responsável por dizer ao Express em qual porta rodar.

```DATABASE_URL``` é a variável responsável pela comunicação com o banco de dados.

## Pipelines
toda mudança na branch ```main``` irá executar uma pipeline onde será feito o build e testes unitários, para duvidas leia o arquivo: ```workflows.yaml```
