#!/bin/bash
yum update -y
yum install -y git
yum install -y docker
systemctl enable docker
systemctl start docker
git clone -b v2.1.1-rc1 https://github.com/samliew94/open-board-games.git ~/open-board-games
