#!/bin/bash
yum update -y
yum install -y git
yum install -y docker

systemctl enable docker
systemctl start docker

# install docker compose manually
DOCKER_CONFIG=${DOCKER_CONFIG:-$HOME/.docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-linux-x86_64 -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

git clone -b v2.1.1-rc1 https://github.com/samliew94/open-board-games.git ~/open-board-games

# See README.md for executing container instructions.