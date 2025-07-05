export HASH=$(shell git rev-parse --short HEAD)


default:
	@echo "Evola Make"
	@echo ${HASH}
	
snapshot: ## Creates a Directus snapshot
	@docker compose exec -it directus npx directus schema snapshot ./snapshots/snapshot.yml

apply: ## Apply Directus snapshot
	@docker compose exec -it directus npx directus schema apply ./snapshots/snapshot.yml
