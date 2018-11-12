# ansible-architecture


## Requirements
The Following things need to be done prior to using this project:

1. Install python: sudo yum install python 
2. Install ansible: sudo yum install ansible
3. Install pip:  sudo yum install python-pip
4. sudo python -m pip install boto3
5. Before running any playbooks ensure a group_vars directory is setup with the correct variables for your aws environment (e.g. qa, production etc.). Take a look at the other group_vars files to determine what vars are needed to run the playbooks (these include things like the region, naming conventions for resources, tags for resources etc.)

# Credentials
In order to run the playbook as password is required per environment (qa, production), due to passing the api credentials for interaction with aws. Passwords can be found in PasswordSafe under AWS ANSIBLE VAULT ENVIRONMENTS.

# Order of playbooks to run

# Creation:
1. createDynamodbTable.yml
2. createLambdaFunction.yml

