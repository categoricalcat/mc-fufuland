#!/bin/bash

docker compose down -v --remove-orphans --rmi all

docker system prune -af

docker compose up
