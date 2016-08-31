/// <reference path="typings/index.d.ts" />
declare function swal(title: string): void;
declare function swal(title: string, body: string): void;
declare var alertify: any;
declare function success(message: string): void;

var choices: string[] = [];

$('#add-choice').click(
    function (e: any): void {
        add(e);
    });

$('#choose').click(
    function (e: any): void {
        decide(e);
    });

$('#choice-field').keyup(function (e: any): void {
    if (e.keyCode == 13) {
        add(e);
    }
});

function add(e: any): void {
    e.preventDefault();
    let choice: any = $('#choice-field');
    let messageLength: number = choice.val().replace(/ /g, '').length;
    if (messageLength > 0) {
        choices.push(choice.val())
        updatePage(choice);
        var width: number = $(window).width();
        if (width>768) {
            alertify.success('Choice Added!');
        }
    } else {
        swal('Please type in a choice.');
    }
}

function updatePage(choice: any): void {
    $('#choice-list-container').append('<p id=\'list-preview' + choices.length + '\' class=\'btn btn-info\' >' + choice.val() + '</p>');
    $('#list-preview' + choices.length).hide();
    $('#list-preview' + choices.length).fadeIn(500);
    $('#list-preview' + choices.length).css('visibility', 'visible');
    choice.val('');
}

function decide(e: any): void {
    e.preventDefault();
    if (choices.length <= 1) {
        swal('Please add more than 1 choices to choose from.');
    } else {
        getRandomNumberFromAPI(choices.length, function (number: number): void {
            let choiceIndex: number = number - 1;
            getNumberTriviaFromAPI(number, function (fact: any): void {
                // Present the data
                let chosenNumber: string = 'Choice number ' + number + ' has been chosen:\t';
                let chosenChoice: string = choices[choiceIndex];
                let chosenFact: string = fact.text;
                swal(chosenNumber + chosenChoice, 'Fun Fact:\t' + chosenFact);
                cleanUp();
            });
        });
    }
}

function cleanUp(): void {
    choices = [];
    $('#choice-list-container').html('');
    $('#choice-field').val('');
}

function getRandomNumberFromAPI(numberOfChoices: number, callback: any): void {
    $.ajax({
        url: 'https://api.random.org/json-rpc/1/invoke',
        beforeSend: function (xhrObj: JQueryXHR): void {
            // Request headers
            xhrObj.setRequestHeader('Content-Type', 'application/json-rpc');
        },
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(
            {
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
            }
        )
    })
        .done(function (data: any): void {
            try {
                callback(data.result.random.data[0]);
            }
            catch (error) {
                let errorMessage: string = error.message;
                swal('An error has occured :( Here is the error message:\n' + errorMessage);
                console.log(errorMessage)
                cleanUp();
            }
        })
        .fail(function (error: any): void {
            let errorMessage: string = error.message;
            swal('An error has occured :( Here is the error message:\n' + errorMessage);
            console.log(error.getAllResponseHeaders());
            console.log(errorMessage);
        });
}

function getNumberTriviaFromAPI(number: number, callback: any): void {
    var url = 'http://numbersapi.com/' + number + '/?json';
    $.ajax({
        url: url,
        type: 'GET',
    })
        .done(function (data: any): void {
            callback(data);
        })
        .fail(function (error: any) {
            let errorMessage: string = error.message;
            swal('An error has occured :( Here is the error message:\n' + errorMessage);
            console.log(error.getAllResponseHeaders());
            console.log(errorMessage);
        });
}