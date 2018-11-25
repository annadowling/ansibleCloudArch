console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = function(event, context) {

    var totalRed = 0;
    var totalGreen = 0;
    var totalBlue = 0;

    event.Records.forEach(function(record) {

        var votedForHash = record.dynamodb['NewImage']['VotedFor']['S'];
        var numVotes = record.dynamodb['NewImage']['Votes']['N'];

        // Determine the color on which to add the vote
        if (votedForHash.indexOf("RED") > -1) {
            votedFor = "RED";
            totalRed += parseInt(numVotes);
        } else if (votedForHash.indexOf("GREEN") > -1) {
            votedFor = "GREEN";
            totalGreen +=  parseInt(numVotes);
        } else if (votedForHash.indexOf("BLUE") > -1) {
            votedFor = "BLUE";
            totalBlue += parseInt(numVotes);
        } else {
            console.log("Invalid vote: ", votedForHash);
        }
    });

    // Update the aggregation table with the total of RED, GREEN, and BLUE
    // votes received from this series of updates

    var aggregatesTable = 'VoteAppAggregates';
    if (totalRed > 0) updateAggregateForColor("RED", totalRed);
    if (totalBlue > 0) updateAggregateForColor("BLUE", totalBlue);
    if (totalGreen > 0) updateAggregateForColor("GREEN", totalGreen);

    console.log('Updating Aggregates Table');

    function updateAggregateForColor(votedFor, numVotes) {
        console.log("Updating Aggregate Color ", votedFor);
        console.log("For NumVotes: ", numVotes);

        var params = {
            ExpressionAttributeNames: {
                "#vote": "Votes"
            },
            ExpressionAttributeValues: {
                ":x": {
                    N: numVotes.toString()
                }
            },
            Key: {
                "VotedFor": {
                    S: votedFor
                }
            },
            ReturnValues: "ALL_NEW",
            TableName: aggregatesTable,
            UpdateExpression: "ADD #vote :x"
        };

        dynamodb.updateItem(params, function(err, data) {
            if (err) {
                console.log(err);
                context.fail("Error updating Aggregates table: ", err)
            } else {
                console.log("Vote received for %s", votedFor);
                context.succeed("Successfully processed " + event.Records.length + " records.");
            }
        });
    }
};
