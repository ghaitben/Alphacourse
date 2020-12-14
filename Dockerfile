<<<<<<< HEAD
FROM node:12.16.3

WORKDIR   /AlphaCourse_prod

ENV PORT 80

COPY package*.json /AlphaCourse_prod/

RUN npm install

CMD ["node","index"]

COPY . /AlphaCourse_prod
=======
FROM
>>>>>>> 9b1ce3687e3f513de3a41b976c8cb3949e7d5b4d
