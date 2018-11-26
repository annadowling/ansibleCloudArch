#!/usr/bin/env bash
ansible-playbook creates3Bucket.yml --vault-id $1-pass
ansible-playbook createDynamodbTable.yml --vault-id $1-pass
ansible-playbook createLambdaFunction.yml --vault-id $1-pass
ansible-playbook createDynamoDBTrigger.yml --vault-id $1-pass