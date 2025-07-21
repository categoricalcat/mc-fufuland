#!/bin/bash

function prune() {
  docker system prune -af --volumes
}

function down_hard() {
  docker compose down --rmi all -v --remove-orphans
}

function up() {
  docker compose up
}
