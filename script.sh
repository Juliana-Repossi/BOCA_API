docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.api.yml down
docker volume rm boca_api_data_postgres 
docker compose -f docker-compose.yml -f docker-compose.prod.yml -f docker-compose.api.yml up -d --build