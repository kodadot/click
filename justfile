set dotenv-load

process: build
	node -r dotenv/config lib/processor.js

serve:
	npx squid-graphql-server

up:
  docker compose up

pull:
  docker compose pull

clear:
  docker compose rm -f
  rm -rf .data

down:
  docker compose down

build:
	npm run build

codegen:
	npx sqd codegen

typegen: ksmVersion
	npx squid-substrate-typegen typegen.json

ksmVersion: explore

explore:
	npx squid-substrate-metadata-explorer \
		--chain wss://basilisk-kodadot.hydration.cloud \
		--archive $ARCHIVE_URL \
		--out kusamaVersions.json

bug: down up

reset:
	npx sqd db drop
	npx sqd db create
	npx sqd db:migrate

new-schema: codegen build update-db

migrate:
	npx sqd db:migrate

update-db:
	npx sqd db:create-migration Data

test:
  npm run test:unit

improve TAG:
	npx sqd squid:update click@{{TAG}}

release TAG:
	npx sqd squid:release click@{{TAG}}

kill TAG:
	npx sqd squid:kill click@{{TAG}}

exec:
	docker exec -it click-db-1 psql -U postgres -d squid

brutal TAG:
	npx sqd squid:update click@{{TAG}} --hardReset

update-deps:
	npx npm-check-updates -u

tail TAG:
	npx sqd squid logs click@{{TAG}} -f

