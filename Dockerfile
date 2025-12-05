# Copyright Tecnalia Research & Innovation (https://www.tecnalia.com)
# Copyright Tecnalia Blockchain LAB
#
# SPDX-License-Identifier: Apache-2.0

FROM node:18-alpine AS build_image

# default values pf environment variables
# that are used inside container

ENV DEFAULT_WORKDIR=/opt
ENV EXPLORER_APP_PATH=$DEFAULT_WORKDIR/explorer

# set default working dir inside container
WORKDIR $EXPLORER_APP_PATH

# install required dependencies by NPM packages:
# current dependencies are: python, make, g++
RUN apk add --no-cache --virtual npm-deps python3 make g++ curl bash py3-setuptools

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

# Optimization: Copy package files first to cache dependencies
COPY package.json package-lock.json ./
COPY client/package.json client/package-lock.json ./client/

# install NPM dependencies
RUN npm install --legacy-peer-deps
RUN cd client && npm install --legacy-peer-deps

# Copy source code
COPY . .

# build explorer app
RUN npm run build
RUN cd client && npm run build

# remove installed packages to free space
RUN npm prune --production
RUN apk del npm-deps
RUN /usr/local/bin/node-prune

RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN rm -rf node_modules/grpc/deps/grpc/third_party/

FROM node:18-alpine

# database configuration
ENV DATABASE_HOST=127.0.0.1
ENV DATABASE_PORT=5432
ENV DATABASE_NAME=fabricexplorer
ENV DATABASE_USERNAME=hppoc
ENV DATABASE_PASSWD=password
ENV EXPLORER_APP_ROOT=app

ENV DEFAULT_WORKDIR=/opt
ENV EXPLORER_APP_PATH=$DEFAULT_WORKDIR/explorer

WORKDIR $EXPLORER_APP_PATH

COPY . .
COPY --from=build_image $EXPLORER_APP_PATH/dist ./app/
COPY --from=build_image $EXPLORER_APP_PATH/client/build ./client/build/
COPY --from=build_image $EXPLORER_APP_PATH/node_modules ./node_modules/

# run blockchain explorer main app
CMD ["/bin/sh", "-c", "npm run app-start && tail -f /dev/null"]
