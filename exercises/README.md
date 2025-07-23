# Log output and ping pong exercises

```.github/workflows/ci-exercises.yaml``` updates the configs to use the latest images automatically after commit.

## Deploying

### Create a cluster without traefik
```sh
k3d cluster create --api-port 6550 -p '9080:80@loadbalancer' -p '9443:443@loadbalancer' --agents 2 --k3s-arg '--disable=traefik@server:*'
```

### Add Knative and Kourier
```sh
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.18.1/serving-crds.yaml
kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.18.1/serving-core.yaml

kubectl apply -f https://github.com/knative/net-kourier/releases/download/knative-v1.18.0/kourier.yaml
kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress-class":"kourier.ingress.networking.knative.dev"}}'

kubectl apply -f https://github.com/knative/serving/releases/download/knative-v1.18.1/serving-default-domain.yaml
```

Deploy:
```sh
## Option 1
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# Get ip and password
kubectl get svc -n argocd
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d


# Option 2
kubectl apply -k .
```

Optional: update greeter to v2 and balance the load between the two versions
```sh
kubectl apply -f manifests/greeter-knative-v2.yaml
```

Access the app
```sh
# Get the URL
$ kubectl get ksvc
NAME         URL                                               LATESTCREATED      LATESTREADY        READY   REASON
greeter      http://greeter.exercises.172.18.0.3.sslip.io      greeter-00001      greeter-00001      True
log-output   http://log-output.exercises.172.18.0.3.sslip.io   log-output-00002   log-output-00002   True
ping-pong    http://ping-pong.exercises.172.18.0.3.sslip.io    ping-pong-00002    ping-pong-00002    True

$ curl -H "Host: log-output.exercises.172.18.0.3.sslip.io" http://localhost:9080
file content: this text is from a file
message: hello world
2025-07-23T20:28:08.186Z: yrvvth599k
Ping / Pongs: 2
greetings: Hello from greeter version v1
```
