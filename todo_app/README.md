# Todo app server

The default port is 3000, but can be configured using the PORT env. variable.

Deploy and test:
```
kubectl apply -f manifests/deployment.yaml
kubectl port-forward [pod-id] 3003:3000
```

Testing with docker:
```docker run -e PORT=4000 -p 4000:4000 hanseni/todo_app:1.5```
