# AWS-EKS staging environments

  ## Asterix cluster
    https://dapr-staging-asterix.assistdevtest.com
    https://seq-staging-asterix.assistdevtest.com
    https://redis-staging-asterix.assistdevtest.com
    https://rabbitmq-staging-asterix.assistdevtest.com
    https://sqlpad-staging-asterix.assistdevtest.com

    https://prometheus-staging-asterix.assistdevtest.com
    https://grafana-staging-asterix.assistdevtest.com
    https://cadvisor-staging-asterix.assistdevtest.com
    https://kube-state-metrics-staging-asterix.assistdevtest.com

    https://anchorservice-staging-asterix.assistdevtest.com/swagger
    https://anchorservice-staging-asterix.assistdevtest.com/metrics
    https://enrollmentservice-staging-asterix.assistdevtest.com/swagger
    https://enrollmentservice-staging-asterix.assistdevtest.com/metrics
    https://perfdevice-staging-asterix.assistdevtest.com/swagger
    https://perfdevice-staging-asterix.assistdevtest.com/metrics

  ## Iris cluster
    https://dapr-staging-iris.assistdevtest.com
    https://seq-staging-iris.assistdevtest.com
    https://redis-staging-iris.assistdevtest.com
    https://rabbitmq-staging-iris.assistdevtest.com
    https://sqlpad-staging-iris.assistdevtest.com

    https://prometheus-staging-iris.assistdevtest.com
    https://grafana-staging-iris.assistdevtest.com
    https://cadvisor-staging-iris.assistdevtest.com
    https://kube-state-metrics-staging-iris.assistdevtest.com

    https://anchorservice-staging-iris.assistdevtest.com/swagger
    https://anchorservice-staging-iris.assistdevtest.com/metrics
    https://enrollmentservice-staging-iris.assistdevtest.com/swagger
    https://enrollmentservice-staging-iris.assistdevtest.com/metrics
    https://perfdevice-staging-iris.assistdevtest.com/swagger
    https://perfdevice-staging-iris.assistdevtest.com/metrics

  ## Idp cluster
    https://dapr-staging-idp.assistdevtest.com
    https://seq-staging-idp.assistdevtest.com/#/events?autorefresh
    https://redis-staging-idp.assistdevtest.com
    https://rabbitmq-staging-idp.assistdevtest.com
    https://sqlpad-staging-idp.assistdevtest.com

    https://prometheus-staging-idp.assistdevtest.com
    https://grafana-staging-idp.assistdevtest.com
    https://cadvisor-staging-idp.assistdevtest.com
    https://kube-state-metrics-staging-idp.assistdevtest.com

    https://anchorservice-staging-idp.assistdevtest.com/swagger
    https://anchorservice-staging-idp.assistdevtest.com/metrics
    https://enrollmentservice-staging-idp.assistdevtest.com/swagger
    https://enrollmentservice-staging-idp.assistdevtest.com/metrics
    https://perfdevice-staging-idp.assistdevtest.com/swagger
    https://perfdevice-staging-idp.assistdevtest.com/metrics
    
    https://idp.assistdevtest.com/
    https://api.assistdevtest.com/swagger/index.html
    https://client.assistdevtest.com/

# VPC network topology

  ## jedi-vpc-staging-purple -- vpc-07b7080ea48fd79fc	

    Iris-Avi-LB -- 13.114.33.251

      jedi-staging-idp eks cluster
        private-ap-northeast-1a               subnet-0cc7ee1b03b1dcdf3	10.21.0.0/18
        private-ap-northeast-1c               subnet-0d48e25ac5ae36a5f	10.21.64.0/18
        public-ap-northeast-1a                subnet-07f4c87da8bc213ee	10.21.128.0/18
        public-ap-northeast-1c                subnet-075dfda1bc393d878	10.21.192.0/18	
      
      jedi-staging-iris eks cluster
        private-ap-northeast-1a               subnet-0cc7ee1b03b1dcdf3	10.21.0.0/18
        private-ap-northeast-1c               subnet-0d48e25ac5ae36a5f	10.21.64.0/18
        public-ap-northeast-1a                subnet-07f4c87da8bc213ee	10.21.128.0/18
        public-ap-northeast-1c                subnet-075dfda1bc393d878	10.21.192.0/18	

      jedi-staging-purple eks cluster
        private-ap-northeast-1a               subnet-0cc7ee1b03b1dcdf3	10.21.0.0/18
        private-ap-northeast-1c               subnet-0d48e25ac5ae36a5f	10.21.64.0/18
        public-ap-northeast-1a                subnet-07f4c87da8bc213ee	10.21.128.0/18
        public-ap-northeast-1c                subnet-075dfda1bc393d878	10.21.192.0/18	

      jedi-staging-orange eks cluster
        private-ap-northeast-1a               subnet-0cc7ee1b03b1dcdf3	10.21.0.0/18
        private-ap-northeast-1c               subnet-0d48e25ac5ae36a5f	10.21.64.0/18
        public-ap-northeast-1a                subnet-07f4c87da8bc213ee	10.21.128.0/18
        public-ap-northeast-1c                subnet-075dfda1bc393d878	10.21.192.0/18	

      jedi-staging-yellow eks cluster
        private-ap-northeast-1a               subnet-0cc7ee1b03b1dcdf3	10.21.0.0/18
        private-ap-northeast-1c               subnet-0d48e25ac5ae36a5f	10.21.64.0/18
        public-ap-northeast-1a                subnet-07f4c87da8bc213ee	10.21.128.0/18
        public-ap-northeast-1c                subnet-075dfda1bc393d878	10.21.192.0/18	
        

  ## jedi-classic-vpc-purple -- vpc-024ffa78034e61c48

    asterix-Avi-LB -- 43.206.216.99

      jedi-staging-idp-asterix eks cluster
        classic-purple-ad-db-private-1a       subnet-0c91aae21ece2a221	10.10.110.0/24
        classic-purple-ad-db-private-1c       subnet-090ec61c36cd99d47	10.10.120.0/24

      classic network topology
        classic-purple-ad-db-private-1a       subnet-0c91aae21ece2a221	10.10.110.0/24
        classic-purple-ad-db-private-1c       subnet-090ec61c36cd99d47	10.10.120.0/24
        classic-purple-blue-private-1a        subnet-019ac42ed7981b456	10.10.50.0/24
        classic-purple-blue-private-1c        subnet-060b07123c880de2d	10.10.60.0/24
        classic-purple-blue-public-1a         subnet-05edd58fdfc7fb908	10.10.30.0/24
        classic-purple-blue-public-1c         subnet-07dd27ec480115709	10.10.40.0/24
        classic-purple-green-private-1a       subnet-0b7a3da7119a548ff	10.10.90.0/24
        classic-purple-green-private-1c       subnet-07cbb20d6bd1354f4	10.10.100.0/24
        classic-purple-green-public-1a        subnet-0d037681cf6939f01	10.10.70.0/24
        classic-purple-green-public-1c        subnet-05a663471e6ee687d	10.10.80.0/24

      jedi-staging-asterix eks cluster
        jedi-ako-asterix-private-1a            subnet-04cb8b613f200ae0a	10.10.0.0/24
        jedi-ako-asterix-private-1c            subnet-07a45b7a519d58bcd	10.10.250.0/24
        jedi-ako-asterix-public-1a             subnet-01bdd2c6abbf8262a	10.10.10.0/24
        jedi-ako-asterix-public-1c             subnet-06c5e0ebbf8bd3205	10.10.20.0/24

      jedi-staging-blue eks cluster
        jedi-ako-blue-private-1a              subnet-0966a79bfec7f932c	10.10.150.0/24
        jedi-ako-blue-private-1c              subnet-0d06ff86f249b7371	10.10.160.0/24
        jedi-ako-blue-public-1a               subnet-0053f373682cbd76d	10.10.130.0/24
        jedi-ako-blue-public-1c               subnet-0cfd13bc5218186c7	10.10.140.0/24

      jedi-staging-green eks cluster
        jedi-ako-green-private-1a             subnet-0367ed7716766b347	10.10.190.0/24
        jedi-ako-green-private-1c             subnet-09794c05bf056df5a	10.10.200.0/24
        jedi-ako-green-public-1a              subnet-0ed7814501772d9d2	10.10.170.0/24
        jedi-ako-green-public-1c              subnet-04f49e233aecaf8ba	10.10.180.0/24

      jedi-staging-red eks cluster
        jedi-ako-red-private-1a              subnet-0737f43649c3b6f6f	10.10.230.0/24
        jedi-ako-red-private-1c              subnet-0fe421bb0c0fb9c5a	10.10.240.0/24
        jedi-ako-red-public-1a               subnet-03f173e02121e48e4	10.10.300.0/24
        jedi-ako-red-public-1c               subnet-00953eba37504972d	10.10.220.0/24
          