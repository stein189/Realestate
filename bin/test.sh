#!/usr/bin/env bash

if [[ $* == *--build ]]; then
    docker-compose -p codehub run --rm realestate npm install
fi;

docker-compose -p codehub run --rm realestate npm run test "$@"
