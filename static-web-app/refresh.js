/* Copyright 2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License"). You may not use
this file except in compliance with the License. A copy of the License is
located at

http://aws.amazon.com/apache2.0/

or in the "license" file accompanying this file. This file is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions and
limitations under the License. */

/* Create the context for applying the chart to the HTML canvas */
var ctx = $("#graph").get(0).getContext("2d");

/* Set the options for our chart */
var options = { segmentShowStroke : false,
    animateScale: true,
    percentageInnerCutout : 50,
    showToolTips: true,
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    tooltipFontColor: "#fff",
    animationEasing : 'easeOutCirc'
}

redValue = 1;
greenValue = 1;
bluevalue = 1;

/* Set the initial data */
var init = [
    {
        value: redValue,
        color: "#e74c3c",
        highlight: "#c0392b",
        label: "Red"
    },
    {
        value: greenValue,
        color: "#2ecc71",
        highlight: "#27ae60",
        label: "Green"
    },
    {
        value: bluevalue,
        color: "#3498db",
        highlight: "#2980b9",
        label: "Blue"
    }
];

graph = new Chart(ctx).Doughnut(init, options);