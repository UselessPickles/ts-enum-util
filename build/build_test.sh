#!/bin/sh
nvm --version
node -v
npm -v

echo '部署前端服务器...'
# cd server
# npm i

npm run build:test

# pm2 startOrReload pm2.config.js --env test
