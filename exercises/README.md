Deploy log output and ping pong:
```sh
kubectl apply -f manifests/namespace.yaml
kubectl apply -f manifests
```

### Note when running on GKE
3 e2-micro nodes might not have enough memory to run the deployment. At least 2 x e2-small seem to work.

Check [ingress ip]:[ingress port]

(Create directory /tmp/kube first on the agent)