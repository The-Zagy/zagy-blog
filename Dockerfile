FROM node:18.14.2-alpine3.17

RUN mkdir /app
COPY . /app

WORKDIR /app
RUN npm i -g pnpm
RUN pnpm --version
RUN ls -al

CMD ["node", "--version"]