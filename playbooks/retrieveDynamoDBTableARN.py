#!/usr/bin/python

#
# (c) 21/11/2018 A.Dowling
#
# retrieveDynamoDBTableARN.py version 1
# boto3
# python version 2.7.3
#
# Script returns ARN of Specified DynamoDB Table (Boto3 was used instead of ansible as there was no way to return this value in ansible currently)
# command to run example: python retrieveDynamoDBTableARN.py

import boto3
import sys

access_key_id = str(sys.argv[1])
secret_access_key = str(sys.argv[2])

client = boto3.client('dynamodb', region_name='eu-west-1', aws_access_key_id=access_key_id,
                      aws_secret_access_key=secret_access_key)

dynamodb_response = client.describe_table(
    TableName='VoteApp'
)

stream_response = client.update_table(
    TableName='VoteApp',
    StreamSpecification={
        'StreamEnabled': True,
        'StreamViewType': 'NEW_AND_OLD_IMAGES'
    }
)

print(stream_response['TableDescription']['LatestStreamArn'])
