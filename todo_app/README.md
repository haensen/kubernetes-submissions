# Todo app server

Deploy and test:
```
kubectl apply -f manifests/deployment.yaml
kubectl port-forward [pod-id] 3003:3000
```

Testing with docker:
```docker run -e PORT=4000 -p 4000:4000 hanseni/todo_app:1.5```
