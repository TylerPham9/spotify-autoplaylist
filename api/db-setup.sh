#!/bin/bash

node_modules/.bin/sequelize db:create spotify
# sequelize db:create spotify

node_modules/.bin/sequelize db:migrate
# sequelize db:migrate

node_modules/.bin/sequelize db:seed:all
# sequelize db:seed:all
