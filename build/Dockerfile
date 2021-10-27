FROM node:14.17.6-alpine3.13 AS builder

ARG JENKINS_ENV

ENV WORK_HOME=/data/node/

ENV JENKINS_ENV=${JENKINS_ENV}

RUN mkdir -p $WORK_HOME

WORKDIR $WORK_HOME

RUN echo 'Asia/Shanghai' > /etc/timezone

COPY ./package*.json ./

RUN if [[ ${JENKINS_ENV} == 'production' ]]; then npm install --production; else npm install; fi

COPY ./ ./

RUN chmod +x ./build/build_start.sh

RUN ./build/build_start.sh ${JENKINS_ENV}

FROM nginx

ARG CI_NGINX_CONFIG_NAME
ARG BUILD_SUB_DIR

ENV WORK_HOME=/data/node/

WORKDIR ${WORK_HOME}

RUN mkdir -p ./566-game-management-frontend/

COPY ./build/nginx/${CI_NGINX_CONFIG_NAME} /etc/nginx/nginx.conf
COPY ./build/nginx/nginx-log /etc/nginx/conf-log
COPY --from=builder /data/node/${BUILD_SUB_DIR} ./566-game-management-frontend/

EXPOSE 8080 80

STOPSIGNAL SIGQUIT
CMD ["nginx", "-g", "daemon off;"]
# CMD tail -f /dev/null