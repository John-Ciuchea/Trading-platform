FROM alpine:latest

RUN apk add --no-cache nats-server
COPY ./server.conf /nats/server.conf
VOLUME /nats/jetstream
EXPOSE 4222

CMD ["nats-server", "-c", "/nats/server.conf"]

