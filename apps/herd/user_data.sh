#!/bin/bash
yum update -y
yum install -y git
yum install -y docker
systemctl enable docker
systemctl start docker
git clone -b v2.0.1-release https://github.com/samliew94/open-board-games.git ~/open-board-games
docker build -t herd:latest ~/open-board-games/apps/herd