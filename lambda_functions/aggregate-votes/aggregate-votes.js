console.log('Loading event');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
var s3 = new AWS.S3();

exports.handler = function (event, context) {

    var totalRed = 0;
    var totalGreen = 0;
    var totalBlue = 0;

    event.Records.forEach(function (record) {

        var votedForHash = record.dynamodb['NewImage']['VotedFor']['S'];
        var numVotes = record.dynamodb['NewImage']['Votes']['N'];

        // Determine the color on which to add the vote
        if (votedForHash.indexOf("RED") > -1) {
            votedFor = "RED";
            totalRed += parseInt(numVotes);
        } else if (votedForHash.indexOf("GREEN") > -1) {
            votedFor = "GREEN";
            totalGreen += parseInt(numVotes);
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

    jsScript = "var ctx = $(\"#graph\").get(0).getContext(\"2d\");\n" +
        "\n" +
        "/* Set the options for our chart */\n" +
        "var options = { segmentShowStroke : false,\n" +
        "    animateScale: true,\n" +
        "    percentageInnerCutout : 50,\n" +
        "    showToolTips: true,\n" +
        "    tooltipEvents: [\"mousemove\", \"touchstart\", \"touchmove\"],\n" +
        "    tooltipFontColor: \"#fff\",\n" +
        "    animationEasing : 'easeOutCirc'\n" +
        "}\n" +
        "\n" +
        "/* Set the initial data */\n" +
        "var init = [\n" +
        "    {\n" +
        "        value: redValue,\n" +
        "        color: \"#e74c3c\",\n" +
        "        highlight: \"#c0392b\",\n" +
        "        label: \"Red\"\n" +
        "    },\n" +
        "    {\n" +
        "        value: greenValue,\n" +
        "        color: \"#2ecc71\",\n" +
        "        highlight: \"#27ae60\",\n" +
        "        label: \"Green\"\n" +
        "    },\n" +
        "    {\n" +
        "        value: bluevalue,\n" +
        "        color: \"#3498db\",\n" +
        "        highlight: \"#2980b9\",\n" +
        "        label: \"Blue\"\n" +
        "    }\n" +
        "];\n" +
        "\n" +
        "graph = new Chart(ctx).Doughnut(init, options);";

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

        dynamodb.updateItem(params, function (err, data) {
            if (err) {
                console.log(err);
                context.fail("Error updating Aggregates table: ", err)
            } else {
                console.log("Vote received for %s", votedFor);

                deleteFile();
                recreateRefreshFile();
            }
        });
    }

    function deleteFile() {
        console.log("Got into Delete file");
        var params = {
            Bucket: 'cloudarchwebappbucket',
            Key: 'refresh.js'
        };
        s3.deleteObject(params, function (err, data) {
            console.log("Got here in delete");
            if (err) {
                console.log("Check if you have sufficient permissions : " + err);
            }
            else {
                console.log("File deleted successfully");
            }
        });
    }

    function recreateRefreshFile() {
        var params = { TableName: 'VoteAppAggregates' };
        var redCount = 0;
        var greenCount = 0;
        var blueCount = 0;

        dynamodb.scan(params, function(err, data) {
            if (err) {
                console.log(err);
                return null;
            } else {
                for (var i in data['Items']) {
                    if (data['Items'][i]['VotedFor']['S'] == "RED") {
                        redCount = parseInt(data['Items'][i]['Votes']['N']);
                    }
                    if (data['Items'][i]['VotedFor']['S'] == "GREEN") {
                        greenCount = parseInt(data['Items'][i]['Votes']['N']);
                    }
                    if (data['Items'][i]['VotedFor']['S'] == "BLUE") {
                        blueCount = parseInt(data['Items'][i]['Votes']['N']);
                    }
                }
            }
        });

        jsScript = jsScript.replace("redValue", redCount);
        jsScript = jsScript.replace("greenValue", greenCount);
        jsScript = jsScript.replace("bluevalue", blueCount);


        console.log("Got into Create file");
        var buffer = Buffer.from(jsScript, 'utf8');
        var params = {
            ACL: 'public-read',
            Body: buffer,
            Bucket: 'cloudarchwebappbucket',
            Key: 'refresh.js'
        };
        s3.putObject(params, function (err, data) {
            console.log("Got here in create");
            if (err) {
                console.log("Check if you have sufficient permissions for S3: " + err);
                context.done();
            }
            else {
                console.log("File created for refresh.js successfully", data);
                context.done();
            }
        });

    }
};
