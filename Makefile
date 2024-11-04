all: build up

up:
	docker compose -f docker-compose.yml up -d

build:
	mkdir -p database
	docker compose -f docker-compose.yml build

down:
	docker compose -f docker-compose.yml down 

clean: down 
	docker compose -f docker-compose.yml --rmi all

re: down all
