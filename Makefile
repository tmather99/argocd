TAG             = v231201_0002
HELM_VERSION    = 0.12.02
ENV             = staging
PROJ            = testbed
REPO            = harbor-repo.vmware.com
HARBOR_PROJ     = $(REPO)/jedi
REPO_TAG        = projects.registry.vmware.com
HARBOR_PROJ_TAG = $(REPO_TAG)/jedi
INGRESS_TYPE    = ingress/ako

ifeq ($(PROJ),blue)
REGION = ap-northeast-1
else ifeq ($(PROJ),red)
REGION = ap-northeast-1
else ifeq ($(PROJ),green)
REGION = ap-northeast-1
else ifeq ($(PROJ),orange)
REGION = ap-northeast-1
else ifeq ($(PROJ),yellow)
REGION = ap-northeast-1
else ifeq ($(PROJ),purple)
REGION = ap-northeast-1
else ifeq ($(PROJ),asterix)
REGION = ap-northeast-1
else ifeq ($(PROJ),iris)
REGION = ap-northeast-1
else ifeq ($(PROJ),idp)
REGION = ap-northeast-1
else ifeq ($(PROJ),idp-asterix)
REGION = ap-northeast-1
else ifeq ($(PROJ),classic)
REGION = ap-northeast-1
else ifeq ($(PROJ),jenkins)
REGION = ap-northeast-1
else ifeq ($(PROJ),testbed)
REGION = ap-northeast-1
else
REGION = ap-northeast-1
endif

ECR_REGION 		= 227368022383.dkr.ecr.$(REGION).amazonaws.com

ecr-login:
	aws ecr get-login-password --region $(REGION) | docker login --username AWS --password-stdin $(ECR_REGION)

.PHONY: sql


#
# k8s cluster contexts
#
get-contexts:
	kubectl config get-contexts

use-context-argocd:
	kubectl config use-context kind-argocd-cluster

use-context:
	kubectl config use-context cloudgate@tmather@jedi-$(ENV)-$(PROJ).$(REGION).eksctl.io
