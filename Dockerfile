# DOCKER-VERSION 0.8.0
FROM		denibertovic/node

RUN			npm install -g supervisor

# Install foreman
RUN			apt-get -y install rubygems
RUN			gem install foreman

# Load in source
ADD 		. /src

# Install app dependencies
RUN 		cd /src; npm install

EXPOSE  	8080

WORKDIR		/src

CMD 		["foreman", "start"]
