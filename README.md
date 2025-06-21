# evola-deliveries.github.io
Website for evola deliveries

* [evola-deliveries.github.io](https://evola-deliveries.github.io)


Running Email client

`docker run -d -v "/root/evola-mail/data:/usr/app/src/data" --restart unless-stopped --name evola-mail dmportella/evola-mail:1.0`

for local testing set all vars
`$(grep -v '^#' web-variables.env | xargs)`

start container
`docker compose --project-directory=./evola-mail up -d`

clear image
`docker rmi dmportella/evola-mail`
