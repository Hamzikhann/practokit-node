Install Dependencies
npm install

Start Server
nodemon

Running Seeds
npx sequelize-cli db:seed:all

Running Migrations
npx sequelize-cli db:migrate


sequelize migration:create --name sos_add_column
sequelize db:migrate

//undo latest migration
sequelize-cli db:migrate:undo

//undo all migration
sequelize-cli db:migrate:undo:all

//undo all seed
npx sequelize-cli db:seed:undo