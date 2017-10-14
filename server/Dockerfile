FROM node:8.6

RUN mkdir -p /server
WORKDIR /server

COPY build/docker/entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
