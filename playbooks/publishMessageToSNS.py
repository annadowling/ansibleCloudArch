#!/usr/bin/python

#
# (c) 27/11/2018 A.Dowling
#
# publishMessageToSNS.py version 1
# boto3
# python version 2.7.3
#
# Script takes String input and sends the message to an SQS queue (no send message to sqs queue module available in ansible)
# command to run example: python publishMessageToSNS.py

import boto3
from ansible_vault import Vault
import sys

password = raw_input("Please enter vault password for api keys: ")
vault = Vault(password)

vote = raw_input("Please enter your vote (RED, GREEN, BLUE): ")
print "you entered", vote

key_data = vault.load(open('../group_vars/aws/vault.yml').read())
secret_access_key = list(key_data.values())[0]
access_key_id = list(key_data.values())[1]
print access_key_id
print secret_access_key

if vote.upper() in ("RED", "GREEN", "BLUE"):
    client = boto3.client('sns', region_name='eu-west-1', aws_access_key_id=access_key_id,
                          aws_secret_access_key=secret_access_key)

    topics_list = client.list_topics(
    )
    print("Topic is")
    vote_topic = topics_list['Topics'][2]['TopicArn']
    print(vote_topic)

    sns_response = client.publish(
        TopicArn=vote_topic,
        Message=vote.upper()
    )

    print("Message sent")
    print("Response is", sns_response)

else:
    print("Incorrect Vote Type Submitted, Please Try Again!")
