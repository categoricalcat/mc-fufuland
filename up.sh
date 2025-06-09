#!/bin/bash

rm -rf ./mc-data

docker compose down

docker system prune -af --volumes

docker compose up
