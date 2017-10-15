# Parkly.pl

### Development

* `$ git clone https://github.com/jacekk/parkly.git`
* `$ cd ./parkly/server`
* `$ yarn install`
* `$ cd ..`
* `$ docker-compose up --build`
* `$ # open new terminal window`
* `$ cd ./client`
* `$ yarn install`
* `$ yarn start`
* open http://localhost:3001 in you favourite browser

### Deploy

* `$ cd /var/www`
* `$ git clone https://github.com/jacekk/parkly.git`
* `$ cd parkly/client`
* `$ yarn install`
* `$ yarn run build:prod`
* `$ cd ../server`
* `$ yarn install`
* `$ yarn run serve:prod` - this will use pm2

Remember to configure a host in nginx (ports 80 and 4444) and run `sudo ufw allow 4444/tcp`.
