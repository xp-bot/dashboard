FROM node:20.5.0
LABEL org.opencontainers.image.description The official docker image of the XP website and dashboard. Built with TypeScript, NextJS and TailwindCSS.

WORKDIR /app
COPY . . 

RUN npm ci
RUN npm run build

CMD ["npm", "run", "start"]