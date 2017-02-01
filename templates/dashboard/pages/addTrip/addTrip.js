console.log(JSON.stringify(UTILS.getCurrentTemplateData()));

// $(".new-trips-content").alpaca({
//     "data": "100.60",
//     "schema": {
//         "format": "ip-address"
//     }
// });
$(document).ready(function() {
    $(".new-trips-content").alpaca({
        "data": "10/15/2001",
        "schema": {
            "format": "date"
        }
    });
});
$(".new-trips-content-test").alpaca({
    "schema": {
        "title":"User Feedback",
        "description":"What do you think about Alpaca?",
        "type":"object",
        "properties": {
            "name": {
                "type":"string",
                "title":"Name"
            },
            "feedback": {
                "type":"string",
                "title":"Feedback"
            },
            "ranking": {
                "type":"string",
                "title":"Ranking",
                "enum":['excellent','ok','so so']
            }
        }
    },
    "options": {
        "helper": "Tell us what you think about Alpaca!",
        "fields": {
            "name": {
                "size": 20,
                "helper": "Please enter your name.",
                "placeholder": "Enter your name"
            },
            "feedback" : {
                "type": "textarea",
                "rows": 5,
                "cols": 40,
                "helper": "Please enter your feedback."
            },
            "ranking": {
                "type": "select",
                "helper": "Select your ranking.",
                "optionLabels": ["Awesome!", "It's Ok", "Hmm..."]
            }
        }
    }
});
