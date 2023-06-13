export HASH=$(shell git rev-parse --short HEAD)


default:
	@echo "Evola Make"
	@echo ${HASH}
	
build:
	@docker build -t dmportella/evola-api:${HASH} ./evola-api
	@docker build -t dmportella/evola-mail:${HASH} ./evola-mail
	@echo "Current Version Hash: "${HASH}

deploy:
	@docker compose --project-directory=./evola-mail up 