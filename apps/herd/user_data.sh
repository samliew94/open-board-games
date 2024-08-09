#!/bin/bash
yum update -y
yum install -y git
yum install -y docker
systemctl enable docker
systemctl start docker
cd /
git clone https://github.com/samliew94/open-board-games.git
cd /open-board-games
git switch v2.0.1-release
cd /open-board-games/apps/herd
docker build -t herd .