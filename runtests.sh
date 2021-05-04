cd bgapi
docker-compose down 
docker-compose build
docker-compose up -d db-test
npm run test
cd ..