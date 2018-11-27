#!/usr/bin/python

#
# (c) 27/11/2018 A.Dowling
#
# sendMessageToQueue.py version 1
# boto3
# python version 2.7.3
#
# Script takes String input and sends the message to an SQS queue
# command to run example: python sendMessageToQueue.py

import boto3
import sys

vote = raw_input("Please enter your vote (RED, GREEN, BLUE): ")
print "you entered", vote

access_key_id = str(sys.argv[1])
secret_access_key = str(sys.argv[2])

client = boto3.client('sqs', region_name='eu-west-1', aws_access_key_id=access_key_id,
                      aws_secret_access_key=secret_access_key)

queue_url = client.get_queue_url(
    QueueName='VoteQueue'
)

print(queue_url)

sqs_response = client.send_message(
    QueueUrl=queue_url,
    MessageBody=vote.upper(),
    DelaySeconds=0
)

print("Message sent")
print("Response is", sqs_response)
