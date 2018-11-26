#!/usr/bin/env bash
ansible-playbook deleteS3Bucket.yml --vault-id $1-pass
ansible-playbook deleteDynamodbTable.yml--vault-id $1-pass
ansible-playbook deleteLambdaFunction.yml--vault-id $1-pass
