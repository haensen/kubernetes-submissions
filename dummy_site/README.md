# Custom resource definition for showing a copy of a web page

## Add the needed crd, controller and rights
```sh
kubectl apply -k .
```
## Test
```sh
kubectl apply -f test_dummy_site.yaml

kubectl get pod
```
```
NAME                                         READY   STATUS    RESTARTS   AGE
dummy-site-controller-dep-5c4f64db6b-rz5mz   1/1     Running   0          37s
dummy-site-google-6c685c78b7-8crtf           1/1     Running   0          31s
dummy-site-wiki-7bb7f7578b-gm22d             1/1     Running   0          31s
```
```sh
kubectl port-forward dummy-site-wiki-7bb7f7578b-gm22d 80
```
Check localhost:80
