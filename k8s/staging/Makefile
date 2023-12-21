include ../../Makefile

REPO          = projects.registry.vmware.com
HELM_REPO     = $(REPO)/jedi
HELM_PATH     = apps

init: \
	ns \
	helm-repos \
	nginx \
	metrics-server

ns:	
	kubectl create namespace argocd
	kubectl create namespace dapr-system
	kubectl create namespace observability

rm-ns:	
	-kubectl delete namespace argocd
	-kubectl delete namespace dapr-system
	-kubectl delete namespace observability

helm-repos:
	helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
	helm repo add bitnami https://charts.bitnami.com/bitnami
	helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
	helm repo add grafana https://grafana.github.io/helm-charts
	helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
	helm repo add dapr https://dapr.github.io/helm-charts/
	helm repo add jetstack https://charts.jetstack.io
	helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
	helm repo add ckotzbauer https://ckotzbauer.github.io/helm-charts
	helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets
	helm repo update

#
# TLS secrets targets
#
cert-manager:
	helm install cert-manager jetstack/cert-manager \
		-n cert-manager --create-namespace \
		--version v1.13.3 --set installCRDs=true

rm-cert-manager:
	helm delete cert-manager -n cert-manager

cluster-issuer:
	kubectl apply -f ./clusters/cluster-issuer.yml

rm-cluster-issuer:
	kubectl delete -f ./clusters/cluster-issuer.yml

secrets: 
	kubectl apply -f ./clusters/$(PROJ)/tls-secrets/argocd-server-tls.yml
	kubectl apply -f ./clusters/$(PROJ)/tls-secrets/dapr-system-tls.yml
	kubectl apply -f ./clusters/$(PROJ)/tls-secrets/observability-tls.yml
	kubectl apply -f ./clusters/$(PROJ)/tls-secrets/otel-collector-tls.yml
	kubectl apply -f ./clusters/$(PROJ)/tls-secrets/assistdevtest-com-tls.yml
	kubectl apply -f ./clusters/$(PROJ)/tls-secrets/signalr-assistdevtest-tls.yml
	kubectl apply -f ./clusters/$(PROJ)/tls-secrets/perfdevice-assistdevtest-tls.yml
 
rm-secrets: 
	-kubectl delete -f ./clusters/$(PROJ)/tls-secrets/argocd-server-tls.yml
	-kubectl delete -f ./clusters/$(PROJ)/tls-secrets/dapr-system-tls.yml
	-kubectl delete -f ./clusters/$(PROJ)/tls-secrets/observability-tls.yml
	-kubectl delete -f ./clusters/$(PROJ)/tls-secrets/otel-collector-tls.yml
	-kubectl delete -f ./clusters/$(PROJ)/tls-secrets/assistdevtest-com-tls.yml
	-kubectl delete -f ./clusters/$(PROJ)/tls-secrets/signalr-assistdevtest-tls.yml
	-kubectl delete -f ./clusters/$(PROJ)/tls-secrets/perfdevice-assistdevtest-tls.yml

#
# ASPNETCORE_Kestrel__Certificates__Default
#
assistdevtest-com-pfx:
	kubectl create secret generic assistdevtest-com-pfx \
		--from-file=assistdevtest-com.pfx=./apps/imagegallery/https/assistdevtest-com.pfx

rm-assistdevtest-com-pfx:
	kubectl delete secret assistdevtest-com-pfx	

# https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl
pfx-passwords:
	kubectl create secret generic pfx-passwords \
	 	--from-literal assistdevtest-com-pfx-password="Assist@1"

rm-pfx-passwords:
	kubectl delete secret pfx-password

#
# Sealed Secrets
#
sealed-secrets-install:
	helm install sealed-secrets -n kube-system \
		--set-string fullnameOverride=sealed-secrets-controller \
		sealed-secrets/sealed-secrets

sealed-secrets-uninstall:
	helm delete sealed-secrets -n kube-system

#
# AKO
#
# helm show chart oci://projects.registry.vmware.com/ako/helm-charts/ako --version 1.10.3
# helm show values oci://projects.registry.vmware.com/ako/helm-charts/ako --version 1.10.3 > values.yaml
ako-primary:
	helm upgrade --install ako-primary \
		oci://projects.registry.vmware.com/ako/helm-charts/ako --version 1.10.3 \
		-f ./clusters/$(PROJ)/ingress/ako/values.yml \
		--namespace=avi-system --create-namespace \
		--set AKOSettings.primaryInstance=true 

rm-ako-primary:
	-helm delete ako-primary -n avi-system	

infrasetting:
	kubectl apply -f ./clusters/$(PROJ)/ingress/ako/infrasetting.yml 

rm-infrasetting:
	-kubectl delete -f ./clusters/$(PROJ)/ingress/ako/infrasetting.yml 

ako: \
	ako-primary \
	infrasetting

rm-ako: \
	rm-ako-primary \
	rm-infrasetting

# 
# ingress targets
#
nginx-helm:
	helm upgrade --install ingress-nginx bitnami/nginx-ingress-controller \
		--create-namespace -n ingress-nginx \
		--set metrics.enabled=true \
		--set replicaCount=3 \
		--set metrics.service.ports.metrics=10254

rm-nginx-helm:
	helm delete ingress-nginx -n ingress-nginx

nginx:
	kubectl apply -f ./clusters/nginx-controller-v1.9.3.yml

rm-nginx:
	-kubectl delete -f ./clusters/nginx-controller-v1.9.3.yml

apps-ingress:
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/apps.yml

rm-apps-ingress:
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/apps.yml

signalr-ingress:
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/signalr.yml

rm-signalr-ingress:
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/signalr.yml

idp-ingress:
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/idp.yml

rm-idp-ingress:
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/idp.yml

api-ingress:
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/api.yml

rm-api-ingress:
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/api.yml

client-ingress:
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/client.yml

rm-client-ingress:
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/client.yml

dapr-dashboard-ingress:
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/dapr-dashboard.yml

rm-dapr-dashboard-ingress:
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/dapr-dashboard.yml

pubsub-ingress:	
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/pubsub.yml

rm-pubsub-ingress:	
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/pubsub.yml

utils-ingress:	
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/utils.yml

rm-utils-ingress:	
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/utils.yml

argocd-ingress:	
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/argocd.yml

rm-argocd-ingress:	
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/argocd.yml

otel-collector-ingress:	
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/otel-collector.yml

rm-otel-collector-ingress:	
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/otel-collector.yml

ingress: dapr-dashboard-ingress
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/argocd.yml
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/grafana.yml
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/otel-collector.yml
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/utils.yml
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/apps.yml
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/perfdevice.yml
	kubectl apply -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/signalr.yml

rm-ingress: rm-dapr-dashboard-ingress
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/argocd.yml
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/grafana.yml
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/otel-collector.yml
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/utils.yml
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/apps.yml
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/perfdevice.yml
	-kubectl delete -f ./clusters/$(PROJ)/$(INGRESS_TYPE)/signalr.yml

# 
# utils targets
#
seq:
	kubectl apply -f ./utils/seq

rm-seq:
	kubectl delete -f ./utils/seq

redis-commander:
	kubectl apply -f ./clusters/$(PROJ)/redis-commander

rm-redis-commander:
	kubectl delete -f ./clusters/$(PROJ)/redis-commander

#
# mssql targets
#
sql:
	kubectl apply -f ./sql

rm-sql:
	kubectl delete -f ./sql

sqlpad:
	kubectl apply -f ./sql/sqlpad.yml

rm-sqlpad:
	kubectl delete -f ./sql/sqlpad.yml

#
# dapr targets
#
dapr-install:	
	helm upgrade --install dapr dapr/dapr --version=1.12.0 -n dapr-system --create-namespace --wait

dapr-uninstall:
	helm uninstall dapr -n dapr-system

dapr-dashboard-install:
	helm upgrade --install dapr-dashboard dapr/dapr-dashboard -n dapr-system 

dapr-dashboard-uninstall:
	helm uninstall dapr-dashboard -n dapr-system

dapr-statestore:
	kubectl apply -f ./clusters/$(PROJ)/dapr/statestore.yml

rm-dapr-statestore:
	kubectl delete -f ./clusters/$(PROJ)/dapr/statestore.yml

dapr-pubsub-rabbitmq:
	kubectl apply -f ./clusters/$(PROJ)/dapr/pubsub-rabbitmq.yml

rm-dapr-pubsub-rabbitmq:
	kubectl delete -f ./clusters/$(PROJ)/dapr/pubsub-rabbitmq.yml

dapr-tracing:
	kubectl apply -f ./clusters/$(PROJ)/dapr/tracing.yml

rm-dapr-tracing:
	kubectl delete -f ./clusters/$(PROJ)/dapr/tracing.yml

dapr-tenants-secrets:
	kubectl create secret generic tenants-secrets --from-file ./clusters/$(PROJ)/dapr/secrets.json
	
rm-dapr-tenants-secrets:
	kubectl delete secret tenants-secrets

dapr-configs: \
 	dapr-statestore \
    dapr-pubsub-rabbitmq \
	dapr-tenants-secrets \
	dapr-tracing

rm-dapr-configs: \
	rm-dapr-statestore \
    rm-dapr-pubsub-rabbitmq \
	rm-dapr-tenants-secrets \
	rm-dapr-tracing

#
# apps targets
#
anchorservice:
	helm install anchorservice apps/anchorservice

rm-anchorservice:
	helm delete anchorservice  

enrollmentservice:
	helm install enrollmentservice apps/enrollmentservice 

rm-enrollmentservice:
	helm delete enrollmentservice 

perfdevice:
	helm install perfdevice apps/perfdevice 

rm-perfdevice:
	helm delete perfdevice 

perfclient:
	helm install perfclient apps/perfclient 

rm-perfclient:
	helm delete perfclient 

signalr:
	kubectl apply -f ./apps/signalr

rm-signalr:
	kubectl delete -f ./apps/signalr

pubsub: \
	consumer \
	producer

rm-pubsub: \
	rm-consumer \
	rm-producer

apps: \
	anchorservice \
	enrollmentservice \
	perfdevice

rm-apps: \
	rm-anchorservice \
	rm-enrollmentservice \
	rm-perfdevice

#
# ImageGallery targets
#
idp:
	kubectl apply -f ./apps/imagegallery/idp.yml

rm-idp:
	-kubectl delete -f ./apps/imagegallery/idp.yml

api:
	kubectl apply -f ./apps/imagegallery/api.yml

rm-api:
	-kubectl delete -f ./apps/imagegallery/api.yml

client:
	kubectl apply -f ./apps/imagegallery/client.yml

rm-client:
	-kubectl delete -f ./apps/imagegallery/client.yml

globosql:
	kubectl apply -f ./apps/imagegallery/globosql.yml

rm-globosql:
	-kubectl delete -f ./apps/imagegallery/globosql.yml

scale-idp: # REPLICAS=3 make scale-idp
	kubectl scale --replicas=${REPLICAS} deployment/imagegallery-idp-app

tail-idp: # IDX=0 make tail-idp
	kubectl logs -f `kubectl get pod -l app=imagegallery-idp-app -o jsonpath="{.items[${IDX}].metadata.name}"`

tail-api:
	kubectl logs -f `kubectl get pod -l app=imagegallery-api-app -o jsonpath="{.items[0].metadata.name}"`

tail-client:
	kubectl logs -f `kubectl get pod -l app=imagegallery-client-app -o jsonpath="{.items[0].metadata.name}"`

#
# observability targets
#

# http://dapr-prom-prometheus-server.observability
prometheus:
	helm upgrade --install dapr-prom prometheus-community/prometheus \
		--create-namespace -n observability \
		--values ./observability/prometheus/values.yml --wait

rm-prometheus:
	helm delete dapr-prom -n observability 

grafana:
	helm upgrade --install dapr-grafana grafana/grafana \
		--create-namespace -n observability --set adminPassword='Assist@1' \
		--values ./observability/grafana/values.yml --wait

rm-grafana:
	helm delete dapr-grafana -n observability

grafana-password:
	kubectl get secret -n observability grafana -o jsonpath="{.data.admin-password}" | base64 -d

# http://loki-gateway.observability.svc.cluster.local
loki:
	helm upgrade --install loki grafana/loki -n observability \
		--create-namespace --values ./observability/loki/values.yml --wait

rm-loki:
	helm delete loki -n observability --wait

rm-logs:
	kubectl delete pod -n observability --force \
		$(kubectl get pods -n observability -l operator.agent.grafana.com/type=logs \
		--output jsonpath='{.items[0].metadata.name}') 

rm-all-pods:
	kubectl delete --all pods -n observability --force

# http://tempo.observability:3100
tempo:
	helm upgrade --install tempo grafana/tempo -n observability --wait

rm-tempo:
	helm delete tempo -n observability

otel-collector:
	kubectl apply -f ./observability/otel-collector --wait

rm-otel-collector:
	kubectl delete -f ./observability/otel-collector

metrics-server:
	helm install --set 'args={--kubelet-insecure-tls}' -n kube-system metrics metrics-server/metrics-server

rm-metrics-server:
	helm delete metrics -n kube-system 

cadvisor:
	helm upgrade --install cadvisor ckotzbauer/cadvisor -n observability --create-namespace

rm-cadvisor:
	helm delete cadvisor -n observability

kube-state-metrics:
	helm upgrade --install kube-state-metrics bitnami/kube-state-metrics -n observability

rm-kube-state-metrics:
	helm delete kube-state-metrics -n observability

up: \
    dapr-install \
	dapr-dashboard-install \
	dapr-configs \
	sql \
	seq \
	redis-commander \
	apps 

down: \
	dapr-uninstall \
	dapr-dashboard-uninstall \
    rm-dapr-configs \
	rm-sql \
	rm-seq \
	rm-redis-commander \
	rm-apps

observability: \
	prometheus \
	cadvisor \
	kube-state-metrics \
	otel-collector \
	grafana \
	tempo \
	loki

rm-observability: \
	rm-prometheus \
	rm-cadvisor \
	rm-kube-state-metrics \
	rm-otel-collector \
	rm-grafana \
	rm-tempo \
	rm-loki 

#
# Route53 DNS records
#

# aws route53 list-hosted-zones
ZONE_ID = Z06538461QK7GI24O24HT
DOMAIN = assistdevtest.com
CNAME_VALUE = `kubectl get service ingress-nginx-controller \
              -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'`

define update_dns_record
	aws route53 change-resource-record-sets \
		--hosted-zone-id ${ZONE_ID} \
		--change-batch '{ "Changes": \
		[{ "Action" : "UPSERT" ,"ResourceRecordSet" : \
		{ "Name" : "'${1}'.$(DOMAIN)" ,"Type" : "CNAME" ,"TTL" : 120 ,"ResourceRecords" : \
		[{ "Value" : "'${2}'" }] } }] }'
endef

CNAMES = \
	argocd \
	seq \
	sqlpad \
	redis \
	dapr \
	grafana \
	prometheus \
	cadvisor \
	kube-state-metrics \
	otel-collector \
	anchorservice \
	enrollmentservice \
	perfdevice \
	signalr \
	signalr-1 \
	signalr-2

dns:
	$(foreach CNAME, $(CNAMES),$(call update_dns_record,$(CNAME)-$(ENV)-$(PROJ),$(CNAME_VALUE))&)

SQL_CNAME_VALUE = `kubectl get service globosql-elb \
				-o jsonpath='{.status.loadBalancer.ingress[0].hostname}'`
dns-globosql:	
	$(call update_dns_record,sql,$(SQL_CNAME_VALUE))
