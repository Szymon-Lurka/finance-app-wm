#!/bin/bash

docker stop backend-api-1
docker rm backend-api-1
docker compose -f docker-compose.yml up --build
