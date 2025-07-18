# Todo app project

Deploy:
```
kubectl apply -k .
```

The todo app becomes available at [ingress ip]:80

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
