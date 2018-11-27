#!/usr/bin/python

#
# (c) 27/11/2018 A.Dowling
#
# addPermissionToLambda.py version 1
# boto3
# python version 2.7.3
#
# Script confirms SNS topic Suscription for Lambda Event Trigger (Boto3 was used instead of ansible as there was no way to set or return this value in ansible currently)
# command to run example: python addPermissionToLambda.py

import boto3
import sys

access_key_id = str(sys.argv[1])
secret_access_key = str(sys.argv[2])
topic_arn = str(sys.argv[3])

client = boto3.client('lambda', region_name='eu-west-1', aws_access_key_id=access_key_id,
                      aws_secret_access_key=secret_access_key)

lambda_response = client.add_permission(
    FunctionName='ReceiveVotes',
    StatementId='SNSTopicId',
    Action='lambda:*',
    Principal='sns.amazonaws.com',
    SourceArn=topic_arn
)

print(lambda_response)
