# Running Container
Choose either `run` or `compose` (_recommended_)  
_Reminder: don't forget to append scheme (http:// or https://) and port!_  


Docker Run
```
docker run \
-e ORIGIN="http://PUBLIC_IPv4_ADDRESS:8080" \
-e JWT_SECRET="FOO" \
-e ROOMS="123" \
-e SECURE="false" \
-e PUBLIC_SOCKET_URL="http://PUBLIC_IPv4_ADDRESS:8081" \
-e SOCKET_PORT="3001" \
-p 8080:3000 \
-p 8081:3001 \
--name herd \
herd
```

Docker Compose
```
WEB_PORT=8080 \
SOCKET_PORT=8081 \
ORIGIN="http://PUBLIC_IPv4_ADDRESS:8080" \
JWT_SECRET="FOO" \
ROOMS="123" \
SECURE="false" \
PUBLIC_SOCKET_URL="http://PUBLIC_IPv4_ADDRESS:8081" \
SOCKET_PORT="3001" \
docker compose up -d --build
```
