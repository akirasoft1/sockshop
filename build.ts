resource "aws_instance" "funnel_sockshop" {
  ami = "${data.aws_ami.ubuntu.id}"
  instance_type = "${var.aws_flavor_sockshop}"
  key_name = "${var.aws_keypair_name}"
  subnet_id= "${aws_subnet.uemload.id}"
  associate_public_ip_address = true
  vpc_security_group_ids = ["${aws_security_group.funnel_sockshop_sg.id}"]
  root_block_device {
    volume_type = "gp2"
    volume_size = "40"
  }
  tags {
    Name = "Unbreakable Funnel - Sock Shop"
  }
  connection {
    type = "ssh"
    user = "ubuntu"
    private_key = "${file("${var.private_key_file}")}"
  }
  provisioner "file" {
    source = "../files/Dockerfile_msd-java"
    destination = "/home/ubuntu/Dockerfile_msd-java"
  }
  provisioner "file" {
    source = "../files/java.sh"
    destination = "/home/ubuntu/java.sh"
  }
  provisioner "remote-exec" {
    inline = [
      "sudo apt-get -y update",
      "sudo apt-get -y install apt-transport-https ca-certificates curl software-properties-common",
      "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
      "sudo add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\"",
      "sudo apt-get -y update",
      "sudo apt-get -y install docker-ce docker-compose openjdk-8-jdk maven",
      "export JAVA_HOME=\"/usr/lib/jvm/java-8-openjdk-amd64\"",
      "git clone https://github.com/microservices-demo/microservices-demo",
      "sudo docker build -f Dockerfile_msd-java . -t weaveworksdemos/msd-java:jre-latest",
      "git clone https://github.com/microservices-demo/carts /home/ubuntu/carts",
      "cd /home/ubuntu/carts",
      "mvn package",
      "sudo docker build . -t weaveworksdemos/carts:0.4.8",
      "git clone https://github.com/microservices-demo/shipping /home/ubuntu/shipping",
      "cd /home/ubuntu/shipping",
      "mvn package",
      "sed -i 's/^FROM.*/FROM openjdk:8-jdk/' docker/shipping/Dockerfile",
      "sed -i 's/^ENTRYPOINT.*/ENTRYPOINT [\"java\",\"-jar\",\".\\/app.jar\",\"--port=80\"]/' docker/shipping/Dockerfile",
      "sed -i '/^RUN.*/d' docker/shipping/Dockerfile",
      "sed -i '/^USER.*/d' docker/shipping/Dockerfile",
      "sed -i '/^ARG.*/d' docker/shipping/Dockerfile",
      "sed -i '/^LABEL.*/d' docker/shipping/Dockerfile",
      "sed -i '/^  org.*/d' docker/shipping/Dockerfile",
      "cd /home/ubuntu/shipping/target",
      "sudo docker build . -f ../docker/shipping/Dockerfile -t weaveworksdemos/shipping:0.4.8",
      "git clone https://github.com/microservices-demo/orders /home/ubuntu/orders",
      "cd /home/ubuntu/orders",
      "mvn package",
      "sed -i 's/^FROM.*/FROM openjdk:8-jdk/' docker/orders/Dockerfile",
      "sed -i 's/^ENTRYPOINT.*/ENTRYPOINT [\"java\",\"-jar\",\".\\/app.jar\",\"--port=80\"]/' docker/orders/Dockerfile",
      "sed -i '/^RUN.*/d' docker/orders/Dockerfile",
      "sed -i '/^USER.*/d' docker/orders/Dockerfile",
      "cd /home/ubuntu/orders/target",
      "sudo docker build . -f ../docker/orders/Dockerfile -t weaveworksdemos/orders:0.4.7",
      "git clone https://github.com/microservices-demo/queue-master /home/ubuntu/queue-master",
      "cd /home/ubuntu/queue-master",
      "mvn package",
      "sed -i 's/^FROM.*/FROM openjdk:8-jdk/' Dockerfile",
      "cd /home/ubuntu/queue-master/target",
      "sudo docker build . -f ../Dockerfile -t weaveworksdemos/queue-master:0.3.1",
      "git clone https://github.com/microservices-demo/catalogue /home/ubuntu/catalogue",
      "cd /home/ubuntu/catalogue",
      "sed -i 's/CGO_ENABLED=0 //' docker/catalogue/Dockerfile",
      "sed -i 's/-installsuffix/-ldflags -linkmode=external -installsuffix/' docker/catalogue/Dockerfile",
      "sed -i 's/FROM alpine.*/FROM ubuntu:16.04/' docker/catalogue/Dockerfile",
      "sed -i '/^\\sapk add.*/d' docker/catalogue/Dockerfile",
      "sed -i '/^\\sadduser.*/d' docker/catalogue/Dockerfile",
      "sed -i 's/^RUN\\saddgroup.*/RUN addgroup --gid \\$${SERVICE_GID} \\$${SERVICE_GROUP} \\&\\& adduser --ingroup \\$${SERVICE_GROUP} --shell \\/sbin\\/nologin --uid \\$${SERVICE_UID} \\$${SERVICE_USER}/' docker/catalogue/Dockerfile",
      "sudo docker build . -f docker/catalogue/Dockerfile -t weaveworksdemos/catalogue:0.3.5",
      "git clone https://github.com/microservices-demo/user /home/ubuntu/user",
      "cd /home/ubuntu/user",
      "sed -i 's/CGO_ENABLED=0 //' docker/user/Dockerfile-release",
      "sed -i 's/-installsuffix/-ldflags -linkmode=external -installsuffix/' docker/user/Dockerfile-release",
      "sed -i 's/FROM alpine.*/FROM ubuntu:16.04/' docker/user/Dockerfile-release",
      "sed -i '/^\\sapk add.*/d' docker/user/Dockerfile-release",
      "sed -i '/^\\sadduser.*/d' docker/user/Dockerfile-release",
      "sed -i 's/^RUN\\saddgroup.*/RUN addgroup --gid \\$${SERVICE_GID} \\$${SERVICE_GROUP} \\&\\& adduser --ingroup \\$${SERVICE_GROUP} --shell \\/sbin\\/nologin --uid \\$${SERVICE_UID} \\$${SERVICE_USER}/' docker/user/Dockerfile-release",
      "sed -i '/^RUN apk.*/d' docker/user/Dockerfile-release",
      "sed -i 's/FROM golang.*/FROM golang:1.7/' docker/user/Dockerfile-release",
      "sudo docker build . -f docker/user/Dockerfile-release -t weaveworksdemos/user:0.4.4",
      "git clone https://github.com/microservices-demo/payment /home/ubuntu/payment",
      "cd /home/ubuntu/payment",
      "sed -i 's/CGO_ENABLED=0 //' docker/payment/Dockerfile",
      "sed -i 's/-installsuffix/-ldflags -linkmode=external -installsuffix/' docker/payment/Dockerfile",
      "sed -i 's/^#EXPOSE/EXPOSE/' docker/payment/Dockerfile",
      "sudo docker build . -f docker/payment/Dockerfile -t weaveworksdemos/payment:0.4.3",
      "cd /home/ubuntu",
      "wget -O Dynatrace-OneAgent.sh \"https://${var.dynatrace_environment_id}.live.dynatrace.com/api/v1/deployment/installer/agent/unix/default/latest?Api-Token=${var.dynatrace_api_token}&arch=x86&flavor=default\"",
      "sudo /bin/sh Dynatrace-OneAgent.sh APP_LOG_CONTENT_ACCESS=1",
      "sudo docker-compose -f microservices-demo/deploy/docker-compose/docker-compose.yml up -d"
    ]
  }
}