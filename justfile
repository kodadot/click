set dotenv-load

process: build
	node -r dotenv/config lib/processor.js

serve:
	@npx squid-graphql-server

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
	npx squid-typeorm-codegen

typegen: ksmVersion
	npx squid-substrate-typegen typegen.json

ksmVersion: explore

explore:
	npx squid-substrate-metadata-explorer \
		--archive $ARCHIVE_URL \
		--out kusamaVersions.jsonl

bug: down up

reset: migrate

quickstart: migrate process

new-schema: codegen build update-db

migrate:
	npx squid-typeorm-migration apply

update-db:
	npx squid-typeorm-migration create-migration Data

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

dump:
	docker exec -i click-db-1 /bin/bash -c "pg_dump --username postgres squid" > dump.sql

evm-typegen FILE OUT:
  npx squid-evm-typegen --abi=src/abi/{{FILE}}.json --output=src/abi/{{OUT}}.ts

erc TAG:
	npx squid-evm-typegen --abi=src/abi/ERC{{TAG}}.json --output=src/abi/erc{{TAG}}.ts