# Log output and ping pong exercises

```.github/workflows/cicd-exercises.yaml``` updates the configs to use the latest images automatically after commit.

## Deploying

Update the cluster with the gateway-api if needed
```sh
gcloud container clusters update [clustername] --location=europe-north1-b --gateway-api=standard
```

Add argo rollouts:
```sh
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
```

Add prometheus:
```sh
# Adding these repos might not be necessary if it has been done before
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add stable https://charts.helm.sh/stable
helm repo update

kubectl create namespace prometheus
helm install kube-prometheus prometheus-community/kube-prometheus-stack --namespace prometheus
```

Install ArgoCD if not done before:
```sh
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# Get ip and password
kubectl get svc -n argocd
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

Deploy log output and ping pong (or use ArgoCD):
```sh
kubectl apply -k .
```

Check [gateway ip]:80

#### Note when running on GKE
3 e2-micro nodes might not have enough memory to run the deployment. At least 2 x e2-small seems to work.
