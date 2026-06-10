# Etapa 1: build de la aplicación React/Vite
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: servir estáticos con nginx
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/zgroup_genset

EXPOSE 3550

CMD ["nginx", "-g", "daemon off;"]
