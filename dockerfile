FROM node:22-alpine

WORKDIR /omerambashar

COPY package.json .

RUN npm i

COPY . /omerambashar

RUN npm run build

EXPOSE 5002

CMD ["npm", "run", "dev"]