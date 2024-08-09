#!/bin/bash
yum update -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 20
nvm use 20
yum install -y docker
systemctl enable docker
systemctl start docker
cd /
git clone https://github.com/samliew94/open-board-games.git
cd /open-board-games
git switch v1.0.0-alpha
cd /open-board-games/apps/herd
docker build -t herd .