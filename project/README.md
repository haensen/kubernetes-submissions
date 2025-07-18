# Todo app project

Update the cluster with the gateway-api if needed
```sh
gcloud container clusters update [clustername] --location=europe-north1-b --gateway-api=standard
```

Deploy:
```
kubectl apply -k .
```

The todo app becomes available at [gateway ip]:80

## Setting up database backups
A secret needs to be created with service account credentials. The service account should have Storage Object User IAM role.
```sh
kubectl create secret generic db-backup-sa --from-file=credentials.json=your_sa.json
```

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
