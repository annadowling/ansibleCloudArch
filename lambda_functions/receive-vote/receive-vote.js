console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = function (event, context) {
    /* Make sure we have a valid vote (one of [RED, GREEN, BLUE]) */
    console.log(event);
    event.Records.forEach(function (record) {
        var votedFor = "";
        if (record['body']) {
            votedFor = record['body'].toUpperCase().trim();
        } else if (record['Sns']['Message']) {
            votedFor = record['Sns']['Message'].toUpperCase().trim();
        } else {
            console.log("COULD NOT PARSE MESSAGE RECEIVED, CHECK FORMAT!")
        }
        if (['RED', 'GREEN', 'BLUE'].indexOf(votedFor) >= 0) {
            /* Add randomness to our value to help spread across partitions */
            votedForHash = votedFor + "." + Math.floor((Math.random() * 10) + 1).toString();
            /* ...updateItem into our DynamoDB database */
            var tableName = 'VoteApp';
            dynamodb.updateItem({
                'TableName': tableName,
                'Key': {'VotedFor': {'S': votedForHash}},
                'UpdateExpression': 'add #vote :x',
                'ExpressionAttributeNames': {'#vote': 'Votes'},
                'ExpressionAttributeValues': {':x': {"N": "1"}}
            }, function (err, data) {
                if (err) {
                    console.log(err);
                    context.fail(err);
                } else {
                    context.done(null, "Thank you for casting a vote for " + votedFor);
                    console.log("Vote received for %s", votedFor);
                }
            });
        } else {
            console.log("Invalid vote received (%s)", votedFor);
            context.fail("Invalid vote received");
        }
    });
}
