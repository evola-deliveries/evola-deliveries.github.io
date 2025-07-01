export HASH=$(shell git rev-parse --short HEAD)


default:
	@echo "Evola Make"
	@echo ${HASH}
	
build:
	@docker compose build

up:
	@docker compose up
	
trigger:
	@docker-compose --profile manual up trigger-fetch
