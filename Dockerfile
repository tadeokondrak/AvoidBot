# syntax=docker/dockerfile:1.4

ARG NODE_VERSION=18.14.1

FROM node:${NODE_VERSION}-slim as base
LABEL fly_launch_runtime="NodeJS"
WORKDIR /app
ENV NODE_ENV=production

FROM base as build
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential
COPY --link package.json .
RUN npm install --production=false
COPY --link . .
RUN npm prune --production

FROM base
COPY --from=build /app /app
CMD [ "node", "main.js" ]
