FROM node:18

RUN apt update

WORKDIR app

COPY ./ /app

RUN yarn --frozen-lockfile
RUN yarn build

CMD yarn start
