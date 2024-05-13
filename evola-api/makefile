export HASH=$(shell git rev-parse --short HEAD)

default:
	@echo "Evola api make"
	@echo "image" ${HASH}
	
network:
  @docker network create evola-api_default

up:
 @docker compose up

down:
 @docker compose down

daemon:
 @docker compose up -d
