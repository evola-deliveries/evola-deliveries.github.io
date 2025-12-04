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

update-api:
	@docker compose --project-directory=./evola-api build
	@docker compose --project-directory=./evola-api up --force-recreate evola-api -d

update-mailer:
	@docker compose --project-directory=./evola-mail build
	@docker compose --project-directory=./evola-mail up --force-recreate evola-mail -d