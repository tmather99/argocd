include ../../Makefile

cluster:
	eksctl create cluster -f $(ENV)/$(PROJ)/config.yml

rm-cluster:
	eksctl delete cluster --region=$(REGION) --name=jedi-$(ENV)-$(PROJ)
