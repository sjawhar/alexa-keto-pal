/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Keto Pal what can I use instead of sugar."
 *  Alexa: "(reads back keto-friendly substitution for sugar)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    foods = require('./foods');

var APP_ID = 'amzn1.echo-sdk-ams.app.d8a64ff8-0913-4ff9-a01b-743e8741eb8a';

/**
 * HowTo is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HowTo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HowTo.prototype = Object.create(AlexaSkill.prototype);
HowTo.prototype.constructor = HowTo;

HowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to Keto Pal. You can ask a question like, what's a substitution for flour? Or, how can I make a low carb pizza? ... Now, how can I help you stay keto?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

HowTo.prototype.intentHandlers = {
    "SubstitutionIntent": function (intent, session, response) {
        var foodSlot = intent.slots.Food,
            foodName;
        if (foodSlot && foodSlot.value){
            foodName = foodSlot.value.toLowerCase();
        }

        var cardTitle = "Keto friendly " + foodName,
            substitution = foods[foodName],
            speechOutput,
            repromptOutput;
        if (substitution) {
            speechOutput = {
                speech: substitution,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, substitution);
        } else {
            var speech;
            if (foodName) {
                speech = "I'm sorry, I currently do not know how to make " + foodName + " keto. Can I help with something else?";
                console.log('unknown food: ' + foodName);
            } else {
                speech = "I'm sorry, I currently do not know that food. What else can I help with?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Thanks for using Keto Pal. Keep calm and keto on.";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Thanks for using Keto Pal. Keep calm and keto on.";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "You can ask me questions like, what can I use for sugar? Or, how can I have bagels on keto? Or, you can say exit... Now, how can I help you stay keto?";
        var repromptText = "You can ask me questions like, what's a low carb sweetener? Or, how can I make keto bagels? Or, you can say exit... Now, how can I help you stay keto?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

exports.handler = function (event, context) {
    var howTo = new HowTo();
    howTo.execute(event, context);
};
