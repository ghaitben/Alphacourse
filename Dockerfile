FROM node:12.16.3

WORKDIR   /AlphaCourse_prod

ENV PORT 80

COPY package*.json /AlphaCourse_prod/

RUN npm install

CMD ["node","index"]

COPY . /AlphaCourse_prod
