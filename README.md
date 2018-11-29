# ansible-architecture
Sample Open Source AWS Application and Lambda code used to demonstrate the functionality for this assignment can be found here:
https://github.com/aws-samples/lambda-refarch-voteapp
This code has been modified substantially to suit the use cases outlined below.

This Serverless architecture looks at using AWS Lambda and other services listed below to build a dynamic voting application, which receives votes via SQS / SNS, 
aggregates the totals into Amazon DynamoDB, and uses Amazon Simple Storage Service (Amazon S3)to display the results in real time via lambda event triggers.

# Services
The following playbooks construct an application architecture that demonstrates how serverless functions can be used to build loosely coupled systems.
The following AWS serverless can be created and deleted via this project using ansible:

- S3 (Create an S3 bucket, sync files to bucket and creates a static web host from bucket and ability to delete full setup.)
- Lambda (Creates functions, uploads function code, assigns aliases and ability to delete full setup.)
- DynamoDB (Creates Tables, Sets table lambda event trigger and ability to delete full setup.)
- SNS (Creates SNS topic, subscribes it to lambda event trigger and ability to delete full setup.)
- SQS (Creates SQS Queue, Sets SQS lambda event trigger and ability to delete full setup.)
- SQS lambda trigger testing script
- SNS lambda trigger testing script
- AWS SDK for Javascript for use with NodeJS 6.10 Lambda scripting.

## Requirements
The Following things need to be done prior to using this project:

1. Install python: sudo yum install python 
2. Install ansible: sudo yum install ansible
3. Install pip:  sudo yum install python-pip
4. sudo python -m pip install boto3
5. Before running any playbooks ensure a group_vars directory is setup with the correct variables for your aws environment (e.g. qa, production etc.). Take a look at the other group_vars files to determine what vars are needed to run the playbooks (these include things like the region, naming conventions for resources, tags for resources etc.)

# Credentials
In order to run the playbook as password is required per environment (qa, production), due to passing the api credentials for interaction with aws. Passwords can be found in PasswordSafe under AWS ANSIBLE VAULT ENVIRONMENTS.

# Order of playbooks / scripts to run

# Creation:
createAll.yml (Combines the below scripts)

1. creates3Bucket.yml
2. createDynamodbTable.yml
3. createLambdaFunction.yml
4. createDynamoDBTrigger.yml
5. createSQSQueue.yml
6. createSNSTopic.yml

# Testing:
## SQS lambda trigger 
Command to run: python sendMessageToQueue.py
- Sends Vote message to Queue to test lambda trigger and view vote update in web application.

## SNS lambda trigger
Command to run: python publishMessageToSNS.py
- Sends Vote message to SNS topic to test lambda trigger and view vote update in web application.

# Deletion:
deleteAll.yml (Combines the below scripts)

1. deleteS3Bucket.yml
2. deleteDynamodbTable.yml
3. deleteLambdaFunction.yml
4. deleteSQSQueue.yml
5. deleteSNSTopic.yml

