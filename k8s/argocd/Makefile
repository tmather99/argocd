include ../../Makefile

GIT_REPO = https://github.com/tmather99/argocd.git

CERT_TLS     = assistdevtest-tls.yml
CERT_PFX     = assistdevtest-com.pfx

#
# cluster targets
#
argocd-cluster:
	kind create cluster --name argocd-cluster --config=kind/argocd-cluster.yml

rm-argocd-cluster:
	kind delete cluster --name argocd-cluster

#
# init targets
#
init: use-context-argocd \
	ns \
	helm-repos \
	nginx-kind \
	metrics-server

ns:	
	kubectl create namespace argocd


helm-repos:
	-helm repo add bitnami https://charts.bitnami.com/bitnami
	-helm repo add jenkins https://charts.jenkins.io
	-helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
	-helm repo add grafana https://grafana.github.io/helm-charts
	-helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server
	-helm repo add dapr https://dapr.github.io/helm-charts
	-helm repo add jetstack https://charts.jetstack.io
	-helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
	-helm repo add ckotzbauer https://ckotzbauer.github.io/helm-charts
	-helm repo add argo https://argoproj.github.io/argo-helm
	-helm repo update

# https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
nginx-kind:
	kubectl apply -f ingress/nginx-controller-kind-v1.9.6.yml

rm-nginx-kind:
	kubectl delete -f ingress/nginx-controller-kind-v1.9.6.yml

metrics-server:
	helm upgrade --install --set 'args={--kubelet-insecure-tls}' \
	             -n kube-system metrics metrics-server/metrics-server

rm-metrics-server:
	helm delete metrics -n kube-system 

#
# argocd targets
#
# helm search repo argo/argo-cd --versions | more
# helm show values argo/argo-cd > values.yml
argocd-install: use-context-argocd argocd-ingress argocd-secrets
	helm upgrade --install argocd -n argocd --create-namespace --version 6.3.1 \
		argo/argo-cd --values values.yml --wait

argocd-uninstall:
	helm delete argocd -n argocd

argocd-password:
	kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo

# kubectl create secret tls assistdevops-tls --key="certs/privkey3.pem" --cert="certs/fullchain3.pem" --dry-run=client -o yaml
argocd-secrets:
	kubectl apply -f ingress/tls-secrets/argocd-$(CERT_TLS)

rm-argocd-secrets:
	kubectl delete -f ingress/tls-secrets/argocd-$(CERT_TLS)

importpfx:
	certutil -q -f -p "Assist@1" -enterprise -importpfx root ".\ingress\tls-secrets\certs\$(CERT_PFX)"

argocd-ingress:
	kubectl apply -f ingress/argocd.yml

rm-argocd-ingress:
	kubectl delete -f ingress/argocd.yml

#
# Argocd settings
#
argocd-update-password:
	$(eval PWD := $(shell kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d))
	argocd login argocd.assistdevtest.com --username admin --password $(PWD) --grpc-web
	argocd account update-password --account admin --current-password $(PWD) --new-password Assist@1 --server argocd.assistdevtest.com --grpc-web

argocd-login:
	argocd login argocd.assistdevtest.com --username admin --password Assist@1 --grpc-web

argocd-add-project:
	argocd proj create $(PROJ) --dest *,* --src '*' --grpc-web
	argocd proj allow-cluster-resource $(PROJ) '*' '*' --grpc-web

argocd-add-cluster:
	argocd cluster add cloudgate@tmather@jedi-$(ENV)-$(PROJ).$(REGION).eksctl.io --grpc-web -y

argocd-add-repo:
	argocd repo add $(GIT_REPO) --insecure-ignore-host-key

argocd-add-oci-repo:
	argocd repo add projects.registry.vmware.com:443/jedi --type helm --name oci-repo --enable-oci

argocd-update-settings: \
	argocd-login \
	argocd-add-project \
	argocd-add-repo \
	argocd-add-cluster

#
# Argocd application deployments
#
argocd-deploy-dapr:
	kubectl apply -f $(ENV)/$(PROJ)/dapr.yml
	
argocd-undeploy-dapr:
	-kubectl delete app -n argocd dapr-$(ENV)-$(PROJ)
	
argocd-deploy-dapr-dashboard:
	kubectl apply -f $(ENV)/$(PROJ)/dapr-dashboard.yml
	
argocd-undeploy-dapr-dashboard:
	-kubectl delete app -n argocd dapr-dashboard-$(ENV)-$(PROJ)
	
argocd-deploy-sql:
	kubectl apply -f $(ENV)/$(PROJ)/sql.yml

argocd-undeploy-sql:
	-kubectl delete app -n argocd sql-$(ENV)-$(PROJ)

argocd-deploy-seq:
	kubectl apply -f $(ENV)/$(PROJ)/seq.yml

argocd-undeploy-seq:
	-kubectl delete app -n argocd seq-$(ENV)-$(PROJ)

argocd-deploy-redis-commander:
	-kubectl apply -f $(ENV)/$(PROJ)/redis-commander.yml

argocd-undeploy-redis-commander:
	-kubectl delete app -n argocd redis-commander-$(ENV)-$(PROJ)

argocd-deploy-utils: \
	argocd-deploy-redis-commander

argocd-undeploy-utils: \
	argocd-undeploy-redis-commander

argocd-deploy-gru: use-context-argocd 
	kubectl apply -f $(ENV)/$(PROJ)/gru.yml

argocd-undeploy-gru: use-context-argocd 
	-kubectl delete app -n argocd gru-$(ENV)-$(PROJ)

argocd-deploy-macminion: use-context-argocd 
	kubectl apply -f $(ENV)/$(PROJ)/macminion.yml

argocd-undeploy-macminion: use-context-argocd 
	-kubectl delete app -n argocd macminion-$(ENV)-$(PROJ)

argocd-deploy-authminion: use-context-argocd 
	kubectl apply -f $(ENV)/$(PROJ)/authminion.yml

argocd-undeploy-authminion: use-context-argocd 
	-kubectl delete app -n argocd authminion-$(ENV)-$(PROJ)

argocd-deploy-webapp-1: use-context-argocd 
	kubectl apply -f $(ENV)/$(PROJ)/webapp-1.yml

argocd-undeploy-webapp-1: use-context-argocd 
	-kubectl delete app -n argocd webapp-1-$(ENV)-$(PROJ)

argocd-deploy-webclient: use-context-argocd 
	kubectl apply -f $(ENV)/$(PROJ)/webclient.yml

argocd-undeploy-webclient: use-context-argocd 
	-kubectl delete app -n argocd webclient-$(ENV)-$(PROJ)

argocd-deploy-testbed: use-context-argocd \
	argocd-deploy-authminion \
	argocd-deploy-gru \
	argocd-deploy-macminion \
	argocd-deploy-webapp-1 \
	argocd-deploy-webclient

argocd-undeploy-testbed: use-context-argocd\
	argocd-undeploy-authminion \
	argocd-undeploy-gru \
	argocd-undeploy-macminion \
	argocd-undeploy-webapp-1 \
	argocd-undeploy-webclient

#
# Argocd apps targets
#
argocd-deploy-anchorservice:
	kubectl apply -f $(ENV)/$(PROJ)/anchorservice.yml

argocd-undeploy-anchorservice:
	-kubectl delete app -n argocd anchorservice-$(ENV)-$(PROJ)

argocd-deploy-enrollmentservice:
	kubectl apply -f $(ENV)/$(PROJ)/enrollmentservice.yml

argocd-undeploy-enrollmentservice:
	-kubectl delete app -n argocd enrollmentservice-$(ENV)-$(PROJ)

argocd-deploy-perfdevice:
	kubectl apply -f $(ENV)/$(PROJ)/perfdevice.yml

argocd-undeploy-perfdevice:
	-kubectl delete app -n argocd perfdevice-$(ENV)-$(PROJ)

argocd-deploy-signalr:
	kubectl apply -f $(ENV)/$(PROJ)/signalr.yml

argocd-undeploy-signalr:
	-kubectl delete app -n argocd signalr-$(ENV)-$(PROJ)

argocd-deploy-apps: use-context-argocd \
	argocd-deploy-anchorservice \
	argocd-deploy-enrollmentservice \
	argocd-deploy-perfdevice \
	
argocd-undeploy-apps: use-context-argocd \
	argocd-undeploy-anchorservice \
	argocd-undeploy-enrollmentservice \
	argocd-undeploy-perfdevice

#	argocd-deploy-redis
#	argocd-deploy-rabbitmq
argocd-deploy: use-context-argocd \
	argocd-deploy-dapr \
	argocd-deploy-dapr-dashboard \
	argocd-deploy-utils

#	argocd-undeploy-redis
#	argocd-undeploy-rabbitmq
argocd-undeploy: use-context-argocd \
	argocd-undeploy-dapr \
	argocd-undeploy-dapr-dashboard \
	argocd-undeploy-utils

#
# Argocd Helm apps targets
#
argocd-deploy-helm-anchorservice:
	kubectl apply -f $(ENV)/$(PROJ)/helm/anchorservice.yml

argocd-undeploy-helm-anchorservice:
	-kubectl delete app -n argocd anchorservice-$(ENV)-$(PROJ)

argocd-deploy-helm-enrollmentservice:
	kubectl apply -f $(ENV)/$(PROJ)/helm/enrollmentservice.yml

argocd-undeploy-helm-enrollmentservice:
	-kubectl delete app -n argocd enrollmentservice-$(ENV)-$(PROJ)

argocd-deploy-helm-perfdevice:
	kubectl apply -f $(ENV)/$(PROJ)/helm/perfdevice.yml

argocd-undeploy-helm-perfdevice:
	-kubectl delete app -n argocd perfdevice-$(ENV)-$(PROJ)

argocd-deploy-helm-apps: \
	argocd-deploy-helm-anchorservice \
	argocd-deploy-helm-enrollmentservice \
	argocd-deploy-helm-perfdevice

argocd-undeploy-helm-apps: \
	argocd-undeploy-helm-anchorservice \
	argocd-undeploy-helm-enrollmentservice \
	argocd-undeploy-helm-perfdevice

# 
# Observability targets
#
argocd-deploy-prometheus: use-context-argocd
	kubectl apply -f $(ENV)/$(PROJ)/observability/prometheus.yml

argocd-undeploy-prometheus: use-context-argocd
	-kubectl delete app -n argocd prometheus-$(ENV)-$(PROJ)

argocd-deploy-grafana:
	kubectl apply -f $(ENV)/$(PROJ)/observability/grafana.yml

argocd-undeploy-grafana:
	-kubectl delete app -n argocd grafana-$(ENV)-$(PROJ)

argocd-deploy-loki:
	kubectl create -f $(ENV)/$(PROJ)/observability/loki.yml

argocd-undeploy-loki:
	-kubectl delete app -n argocd loki-$(ENV)-$(PROJ)

argocd-deploy-tempo:
	kubectl apply -f $(ENV)/$(PROJ)/observability/tempo.yml

argocd-undeploy-tempo:
	-kubectl delete app -n argocd tempo-$(ENV)-$(PROJ)

argocd-deploy-otel-collector:
	kubectl apply -f $(ENV)/$(PROJ)/observability/otel-collector.yml

argocd-undeploy-otel-collector:
	-kubectl delete app -n argocd otel-collector-$(ENV)-$(PROJ)

argocd-deploy-cadvisor:
	kubectl apply -f $(ENV)/$(PROJ)/observability/cadvisor.yml

argocd-undeploy-cadvisor:
	-kubectl delete app -n argocd cadvisor-$(ENV)-$(PROJ)

argocd-deploy-kube-state-metrics:
	kubectl apply -f $(ENV)/$(PROJ)/observability/kube-state-metrics.yml

argocd-undeploy-kube-state-metrics:
	-kubectl delete app -n argocd kube-state-metrics-$(ENV)-$(PROJ)

argocd-deploy-blackbox-exporter:
	kubectl apply -f $(ENV)/$(PROJ)/observability/blackbox.yml

argocd-undeploy-blackbox-exporter:
	-kubectl delete app -n argocd blackbox-$(ENV)-$(PROJ)

argocd-deploy-observability: use-context-argocd \
	argocd-deploy-otel-collector \
	argocd-deploy-kube-state-metrics \
	argocd-deploy-cadvisor \
	argocd-deploy-prometheus \
	argocd-deploy-blackbox-exporter \
	argocd-deploy-grafana \
	argocd-deploy-tempo \
	argocd-deploy-loki

argocd-undeploy-observability: use-context-argocd \
	argocd-undeploy-otel-collector \
	argocd-undeploy-kube-state-metrics \
	argocd-undeploy-cadvisor \
	argocd-undeploy-prometheus \
	argocd-undeploy-blackbox-exporter \
	argocd-undeploy-grafana \
	argocd-undeploy-tempo \
	argocd-undeploy-loki 
	
