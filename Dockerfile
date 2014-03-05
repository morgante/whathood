# DOCKER-VERSION 0.8.0
FROM		denibertovic/node

RUN			npm install -g supervisor

# Install foreman
RUN			apt-get -y install rubygems
RUN			gem install foreman

# Install app dependencies
ADD			package.json /src/package.json
RUN			cd /src && npm install

# Load in source
ADD 		. /src

EXPOSE  	8080

WORKDIR		/src

CMD 		["foreman", "start"]
