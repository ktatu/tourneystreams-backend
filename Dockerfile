FROM node:18.16.1-alpine

EXPOSE 10000

WORKDIR /usr/src/app/

COPY . .

RUN npm ci && \
    npm run tsc

RUN apk add git && \
    git clone https://github.com/ktatu/apextourneystreams-frontend.git && \
    cd apextourneystreams-frontend && \
    npm ci && \
    npm run build && \
    mv build ../ && \
    cd .. && \
    rm -rf apextourneystreams-frontend

WORKDIR /usr/src/app/

CMD npm run start:prod