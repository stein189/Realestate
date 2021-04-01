#!/usr/bin/env bash

if [[ $* == *--build ]]; then
    docker-compose -p codehub run --rm realestate npm install
fi;

docker-compose -f docker-compose-infrastructure.yml -p codehub up --build -d
docker-compose -p codehub up --build
