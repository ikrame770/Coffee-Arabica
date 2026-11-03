FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG REACT_APP_API_URL
ARG REACT_APP_ADMIN_USERNAME
ARG REACT_APP_ADMIN_PASSWORD

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ADMIN_USERNAME=$REACT_APP_ADMIN_USERNAME
ENV REACT_APP_ADMIN_PASSWORD=$REACT_APP_ADMIN_PASSWORD
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]