/// <reference path="typings/index.d.ts" />
var choices = [];
var addChoice = $('#add-choice');
var choose = $('#choose');
var choiceField = $('#choice-field');
var choiceListContainer = $('#choice-list-container');
addChoice.click(function (e) {
    add(e);
});
choose.click(function (e) {
    decide(e);
});
choiceField.keyup(function (e) {
    if (e.keyCode == 13) {
        add(e);
    }
});
function add(e) {
    e.preventDefault();
    var choice = choiceField;
    var messageLength = choice.val().replace(/ /g, '').length;
    if (messageLength > 0) {
        choices.push(choice.val());
        updatePage(choice);
        var width = $(window).width();
        if (width > 768) {
            alertify.success('Choice Added!');
        }
    }
    else {
        choiceField.blur();
        retryInput();
    }
}
function retryInput() {
    swal({
        title: "Your choice is blank ...",
        text: "Please type in a choice.",
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "OK"
    });
}
function updatePage(choice) {
    $('#choice-list-container').append('<p id=\'list-preview' + choices.length + '\' class=\'btn btn-info\' >' + choice.val() + '</p>');
    $('#list-preview' + choices.length).hide();
    $('#list-preview' + choices.length).fadeIn(500);
    $('#list-preview' + choices.length).css('visibility', 'visible');
    choice.val('');
}
function decide(e) {
    e.preventDefault();
    choiceField.blur();
    if (choices.length <= 1) {
        swal({
            title: "You don't have enough choices ...",
            text: "Please add more choices.",
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: "OK"
        });
    }
    else {
        getRandomNumberFromAPI(choices.length, function (number) {
            var choiceIndex = number - 1;
            getNumberTriviaFromAPI(number, function (fact) {
                // Present the data
                var chosenNumber = 'Choice #' + number + ' has been chosen:\t';
                var chosenChoice = choices[choiceIndex];
                var chosenFact = fact.text;
                choiceField.blur();
                showChoiceAndFact(chosenNumber, chosenChoice, chosenFact);
                cleanUp();
            });
        });
    }
}
function showChoiceAndFact(chosenNumber, chosenChoice, chosenFact) {
    swal({
        title: chosenNumber + chosenChoice,
        text: 'Fun Fact:\t' + chosenFact,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "OK"
    });
}
function cleanUp() {
    choices = [];
    choiceListContainer.html('');
    choiceField.val('');
}
function getRandomNumberFromAPI(numberOfChoices, callback) {
    $.ajax({
        url: 'https://api.random.org/json-rpc/1/invoke',
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader('Content-Type', 'application/json-rpc');
        },
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            'jsonrpc': '2.0',
            'method': 'generateIntegers',
            'params': {
                'apiKey': '5c868d24-5e66-4927-942f-095abd761219',
                'n': 1,
                'min': 1,
                'max': numberOfChoices,
                'replacement': true
            },
            'id': 1
        })
    })
        .done(function (data) {
        try {
            callback(data.result.random.data[0]);
        }
        catch (error) {
            var errorMessage = error.message;
            swal('An error has occured :( Here is the error message:\n' + errorMessage);
            console.log(errorMessage);
            cleanUp();
        }
    })
        .fail(function (error) {
        var errorMessage = error.message;
        swal('An error has occured :( Here is the error message:\n' + errorMessage);
        console.log(error.getAllResponseHeaders());
        console.log(errorMessage);
    });
}
function getNumberTriviaFromAPI(number, callback) {
    var url = 'http://numbersapi.com/' + number + '/?json';
    $.ajax({
        url: url,
        type: 'GET',
    })
        .done(function (data) {
        callback(data);
    })
        .fail(function (error) {
        var errorMessage = error.message;
        swal('An error has occured :( Here is the error message:\n' + errorMessage);
        console.log(error.getAllResponseHeaders());
        console.log(errorMessage);
    });
}
