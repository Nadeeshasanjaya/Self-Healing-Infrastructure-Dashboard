

resource "aws_security_group" "self_healing_sg" {

  name        = "self-healing-sg"
  description = "Security group for Self-Healing Dashboard"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["175.157.116.189/32"]

  }
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]


  }

}
resource "aws_instance" "self_healing_server" {
  ami           = "ami-0c0fd09cfe77b59dc"
  instance_type = "t3.micro"
  key_name      = "self-healing-key"

  vpc_security_group_ids = [aws_security_group.self_healing_sg.id]

}