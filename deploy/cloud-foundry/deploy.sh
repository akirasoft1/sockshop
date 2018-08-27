cf push front-end -o jbraeuer/front-end:latest (RUNNING)

cf push edge-router -o weaveworksdemos/edge-router:0.1.1 (RUNNING)

cf push catalogue -o jbraeuer/catalogue:latest (RUNNING)
cf create-service p-mysql 100mb catalogue-db >>> cf bind-service catalogue catalogue-db (RUNNING)

cf push carts -o jbraeuer/carts:latest (RUNNING)
*cf create-service mongodb-odb standalone_small carts-db >>> cf bind-service carts carts-db (RUNNING)

cf push orders -o jbraeuer/orders:latest (RUNNING)
*cf create-service mongodb-odb standalone_small orders-db >>> cf bind-service orders orders-db (RUNNING)

cf push shipping -o jbraeuer/shipping:latest (RUNNING)

cf push queue-master -o jbraeuer/queue-master:latest (RUNNING)

cf create-service p-rabbitmq standard rabbitmq >>> cf bind-service shipping rabbitmq >>> cf bind-service queue-master rabbitmq (RUNNING)

cf push payment -o jbraeuer/payment:latest (RUNNING)

cf push user -o jbraeuer/user:latest (RUNNING)
*cf create-service mongodb-odb standalone_small user-db >>> cf bind-service user user-db (FAILED)

cf push load-test -o weaveworksdemos/load-test:0.1.1 (FAILED)