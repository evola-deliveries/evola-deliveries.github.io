# Directus

# snapshotting 

`docker compose exec -it directus npx directus schema snapshot ./snapshots/snapshot.yml`

`docker compose exec -it directus npx directus schema apply ./snapshots/snapshot.yml`