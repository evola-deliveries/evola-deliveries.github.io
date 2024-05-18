export HASH=$(shell git rev-parse --short HEAD)


default:
	@echo "Evola Make"
	@echo ${HASH}
	
build:
	@docker build -t dmportella/evola-api:${HASH} ./evola-api
	@docker tag dmportella/evola-api:${HASH} dmportella/evola-api:latest
	
	@docker build -t dmportella/evola-mail:${HASH} ./evola-mail
	@docker tag dmportella/evola-mail:${HASH} dmportella/evola-mail:latest
	
	@echo "Current Version Hash: "${HASH}
	
deploy:
	@docker compose --project-directory=./evola-mail up 