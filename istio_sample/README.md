## Deploying the sample application from [iostio](https://istio.io/latest/docs/ambient/getting-started/)

### Create a cluster without traefik
```sh
k3d cluster create --api-port 6550 -p '9080:80@loadbalancer' -p '9443:443@loadbalancer' --agents 2 --k3s-arg '--disable=traefik@server:*'
```

### (Change kubeconfig to point to localhost instead of host.docker.internal if kubectl times out)

### Install istio to k3d
```sh
# Add repo if not done before
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo update

kubectl get crd gateways.gateway.networking.k8s.io &> /dev/null || \
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.3.0/standard-install.yaml

istioctl install --set profile=ambient --skip-confirmation --set values.global.platform=k3d
```

### Deploy bookinfo app
```sh
kubectl apply -k manifests-part1
```

### Change LoadBalancer to ClusterIP by annotating
```sh
kubectl annotate gateway bookinfo-gateway networking.istio.io/service-type=ClusterIP --namespace=default
```

### Access the application
```sh
kubectl port-forward svc/bookinfo-gateway-istio 8080:80
```
Check localhost:8080/productpage with browser

### Include the pods into the ambient mesh by labeling the namespace
```sh
kubectl label namespace default istio.io/dataplane-mode=ambient
```

### Visualize the application and metrics
```sh
kubectl apply -k manifests-part2
# Wait for a while
istioctl dashboard kiali
# In separate shell
for i in $(seq 1 100); do curl -sSI -o /dev/null http://localhost:8080/productpage; done
```

### Test the L4 authorization policy
```sh
# This should fail, but the productpage should still be available through the gateway
kubectl exec deploy/curl -- curl -s "http://productpage:9080/productpage"
```

### Allow curl's traffic with L7 authorization policy
```sh
# Add a waypoint proxy for L7 traffic
istioctl waypoint apply --enroll-namespace --wait

# Allow curl to connect to productpage through the waypoint
kubectl apply -f manifests-part3/curl-authorizationpolicy.yaml
# Allow the waypoint to connect to the productpage
kubectl apply -f manifests-part3/authorizationpolicy.yaml

# This returns now the page
kubectl exec deploy/curl -- curl -s "http://productpage:9080/productpage"
# Should still fail because identity is of the reviews-v1 service
kubectl exec deploy/reviews-v1 -- curl -s http://productpage:9080/productpage
```

### Configure 90% of the requests to reviews-v1 and 10% to reviews-v2
```sh
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: reviews
spec:
  parentRefs:
  - group: ""
    kind: Service
    name: reviews
    port: 9080
  rules:
  - backendRefs:
    - name: reviews-v1
      port: 9080
      weight: 90
    - name: reviews-v2
      port: 9080
      weight: 10
EOF

# Test
kubectl exec deploy/curl -- sh -c "for i in \$(seq 1 100); do curl -s http://productpage:9080/productpage | grep reviews-v.-; done"
```
