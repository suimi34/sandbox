database:
	docker compose up -d db

bundle:
	docker compose run --rm --no-deps web bundle

migrate:
	docker compose run --rm --no-deps web bundle exec rails db:migrate

web:
	docker compose up --no-deps web

schema:
	docker compose run --rm --no-deps web rails graphql:schema:dump
