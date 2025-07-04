export HASH=$(shell git rev-parse --short HEAD)


default:
	@echo "Evola Make"
	@echo ${HASH}
	
build:
	@docker compose --project-directory=./evola-api build
	@docker compose --project-directory=./evola-mail build 
	@docker compose --project-directory=./evola-courier build

run:
	@docker compose --project-directory=./evola-api up -d
	@docker compose --project-directory=./evola-cms up -d
	@docker compose --project-directory=./evola-courier up -d

stop:
	@docker compose --project-directory=./evola-api down
	@docker compose --project-directory=./evola-cms down
	@docker compose --project-directory=./evola-courier down