/// <reference path="typings/index.d.ts" />
var choices = [];
$('#add-choice').click(function (e) {
    add(e);
});
$('#choose').click(function (e) {
    decide(e);
});
$('#choice-field').keyup(function (e) {
    if (e.keyCode == 13) {
        add(e);
    }
});
function add(e) {
    e.preventDefault();
    var choice = $('#choice-field');
    var messageLength = choice.val().replace(/ /g, '').length;
    if (messageLength > 0) {
        choices.push(choice.val());
        updatePage(choice);
        alertify.success('Choice Added!');
    }
    else {
        swal('Please type in a choice');
    }
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
    if (choices.length <= 1) {
        swal('Please add more than 1 choices to choose from.');
    }
    else {
        getRandomNumberFromAPI(choices.length, function (number) {
            var choiceIndex = number - 1;
            getNumberTriviaFromAPI(number, function (fact) {
                // Present the data
                var chosenNumber = 'Choice number ' + number + ' has been chosen:\t';
                var chosenChoice = choices[choiceIndex];
                var chosenFact = fact.text;
                swal(chosenNumber + chosenChoice, 'Fun Fact:\t' + chosenFact);
                cleanUp();
            });
        });
    }
}
function cleanUp() {
    choices = [];
    $('#choice-list-container').html('');
    $('#choice-field').val('');
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
