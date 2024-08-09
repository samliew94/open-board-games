# Running Container with ENV (runtime)
Localhost:
```
docker run \
-e ORIGIN="http://localhost:8080" \
-e JWT_SECRET="FOO" \
-e ROOMS="123" \
-e PUBLIC_SOCKET_URL="http://localhost:8081" \
-e SOCKET_PORT="3001" \
-p 8080:3000 \
-p 8081:3001 \
herd
```

Production:
```
docker run \
-e ORIGIN="https://ELB-FOO-BAR:8080" \
-e JWT_SECRET="!pD^&@#00bdAS&d62" \
-e ROOMS="LYPKPG" \
-e PUBLIC_SOCKET_URL="https://ELB-FOO-BAR:8081" \
-e SOCKET_PORT="3001" \
-p 8080:3000 \
-p 8081:3001 \
herd
```