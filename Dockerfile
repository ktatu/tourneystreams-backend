FROM node:18.16.1-alpine as typescript-compilation

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run tsc

FROM node:18.16.1-alpine

EXPOSE 10000

WORKDIR /usr/src/app

COPY --from=ktatu/tourneystreams-frontend-build:main /usr/src/app/build /usr/src/app/build

COPY --from=typescript-compilation /usr/src/app/backend_build /usr/src/app/backend_build

COPY package*.json .

RUN npm ci --omit=dev

CMD npm run start:prod