Update the cluster with the gateway-api if needed
```sh
gcloud container clusters update [clustername] --location=europe-north1-b --gateway-api=standard
```

Add prometheus:
```sh
# Adding these repos might not be necessary if it has been done before
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add stable https://charts.helm.sh/stable
helm repo update

kubectl create namespace prometheus
helm install prometheus-community/kube-prometheus-stack --generate-name --namespace prometheus
```

Add argo rollouts:
```sh
kubectl create namespace argo-rollouts
kubectl apply -n argo-rollouts -f https://github.com/argoproj/argo-rollouts/releases/latest/download/install.yaml
```

Change the analysistemplate.yaml to connect to the correct service. Find the service-name with ```kubectl get svc -n prometheus | grep 9090```

Deploy log output and ping pong:
```sh
kubectl apply -k .
```

Check [gateway ip]:80

#### Note when running on GKE
3 e2-micro nodes might not have enough memory to run the deployment. At least 2 x e2-small seem to work.
