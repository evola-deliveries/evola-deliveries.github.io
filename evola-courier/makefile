export HASH=$(shell git rev-parse --short HEAD)


default:
	@echo "Evola Make"
	@echo ${HASH}
	
build:
	@docker compose --profile manual build

down:
	@docker-compose --profile manual down --remove-orphans

up:
	@docker compose up
	
trigger:
	@docker-compose --profile manual up trigger-fetch

courier:
	@docker-compose --profile manual up courier-service

watcher:
	@docker-compose --profile manual up contract-watcher