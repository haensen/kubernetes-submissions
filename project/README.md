# Todo app project

```.github/workflows/ci-project.yaml``` builds the images and updates the config when a commit changes them.

## Deploying
#### Update the cluster with the gateway-api if needed
```sh
gcloud container clusters update [clustername] --location=europe-north1-b --gateway-api=standard
```

#### Add prometheus:
```sh
# Adding these repos might not be necessary if it has been done before
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add stable https://charts.helm.sh/stable
helm repo update

kubectl create namespace prometheus
helm install kube-prometheus prometheus-community/kube-prometheus-stack --namespace prometheus
```

#### Setup ArgoCD to sync the changes from this repo.
```sh
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'

# Get ip and password
kubectl get svc -n argocd
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Following steps needs to be done for both staging and production

#### Create namespace
```sh
kubectl create namespace staging
kubens staging

# On production
kubectl create namespace production
kubens production
```

#### Set password for Postgresql
```sh
kubectl create secret generic postgres-secret --from-literal=POSTGRES_PASSWORD=yourpassword
```

#### Setup NATS
```sh
helm install -f base/nats-settings.yaml nats-staging oci://registry-1.docker.io/bitnamicharts/nats

# On production
helm install -f base/nats-settings.yaml nats-production oci://registry-1.docker.io/bitnamicharts/nats
```

#### Sync the git repo with ArgoCD
```sh
kubectl apply -n argocd -f overlays/staging/application.yaml

# On production
kubectl apply -n argocd -f overlays/production/application.yaml
```

#### Configure Prometheus to fetch metrics for NATS (optional)
```sh
kubectl label servicemonitors.monitoring.coreos.com -n prometheus nats-staging-metrics release=kube-prometheus

# On production
kubectl label servicemonitors.monitoring.coreos.com -n prometheus nats-production-metrics release=kube-prometheus
```
[Grafana dashboard for NATS](https://raw.githubusercontent.com/nats-io/prometheus-nats-exporter/5084a32850823b59069f21f3a7dde7e488fef1c6/walkthrough/grafana-nats-dash.json)

### Settings for production

#### Setting up database backups.
A secret needs to be created with service account credentials. The service account should have Storage Object User IAM role.
```sh
kubectl create secret generic db-backup-sa --from-file=credentials.json=your_sa.json
```

#### To setup up a webhook that is called when a todo is added or changed, edit ```base/overlays/production/broadcaster-deployment.yaml```

The todo app becomes available at [gateway ip]:80

## Pros/cons of using DBaaS vs DIY

### Reasons to use DBaaS
- Initial work and cost required to setup is minimal
- Automated backups, replication and storage increases
### Why not?
- More expensive in long run

### Reasons to use postgres on a pod
- Cheaper to run
- The setup with Kubernetes is mostly portable across different providers
### Why not?
- Initial setup requires some knowledge and work
- Setting up backups requires some amount of work
- Replication and storage size changes need to be done manually (or automated somehow)
