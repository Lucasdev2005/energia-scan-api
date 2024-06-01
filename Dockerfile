## copiando projeto para container e realizando build. ##
FROM node:18 as builder

COPY . .

RUN npm install
RUN npx prisma generate
RUN npm run build

## copiando dist do projeto e rodando em container separado. ##
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /dist ./
COPY --from=builder package*.json ./
COPY --from=builder /prisma ./prisma

RUN npm ci --production

CMD npx prisma migrate deploy && npm run start