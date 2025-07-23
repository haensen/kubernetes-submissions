# Wikipedia pages from init and sidecar containers

```sh
kubectl apply -f nginx-deployment.yaml

kubectl port-forward pod/your-pod 80

```
Check the logs of the sidecar to see available pages
