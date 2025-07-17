# Ping pong application

Deploy:
```
kubectl apply -f ../manifests/namespace.yaml
kubectl apply -f ../manifests/ping-pong-deployment.yaml
kubectl apply -f ../manifests/ping-pong-service.yaml
kubectl apply -f ../manifests/postgres.yaml
```

GET [ping-pong-svc external ip]:2345/pingpong returns "pong [count]"
