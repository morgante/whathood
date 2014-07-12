# DOCKER-VERSION 0.8.0
FROM		denibertovic/node

RUN			npm install -g supervisor

# Install foreman
RUN			apt-get -y install rubygems
RUN			gem install foreman

# Start app dir
RUN 		mkdir /app

# Install app dependencies
ADD 		./package.json /app/package.json
RUN			cd /app; npm install -d

# Load app dependencies
ADD 		. /app/src

EXPOSE  	8080

WORKDIR		/app/src

ENV 		SECRET thisissecret

CMD 		["npm", "start"]
