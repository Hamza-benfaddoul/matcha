all: build up

up:
	mkdir -p apps/frontend/node_modules
	mkdir -p apps/backend/node_modules
	docker compose -f docker-compose.yml up -d

build:
	mkdir -p database
	docker compose -f docker-compose.yml build

down:
	docker compose -f docker-compose.yml down 

clean: down 
	docker compose -f docker-compose.yml --rmi all

re: down all

