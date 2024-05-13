# evola api
Runs the api for evola eve and uses lets encrypt to run the api

# Certbot
To run the app you need to generate the certs, this needs to have the nginx in the docker compose running with the register.conf config then run the lines below
once they all run and things are made, replace the config again with the normal config in the nginx.conf

## dry run
`docker run -it --rm --name meh -v ./data/certbot/conf:/etc/letsencrypt:rw -v ./data/certbot/www:/var/www/certbot:rw certbot/certbot certonly --dry-run -v`

## live run
`docker run -it --rm --name meh -v ./data/certbot/conf:/etc/letsencrypt:rw -v ./data/certbot/www:/var/www/certbot:rw certbot/certbot certonly -v`
