/// <reference path="typings/index.d.ts" />
declare function swal(title: any): void;
declare function swal(title: string, body: string): void;
declare var alertify: any;
declare function success(message: string): void;

var choices: string[] = [];
var addChoice = $('#add-choice');
var choose = $('#choose');
var choiceField = $('#choice-field');
var choiceListContainer = $('#choice-list-container');
var spin = $('.spin');
var chooseText = $('.choose-text');

$( document ).ready( function(): void {
    spin.hide();
} );


addChoice.click(
    function (e: any): void {
        add(e);
    });

choose.click(
    function (e: any): void {
        decide(e);
    });

choiceField.keyup(function (e: any): void {
    if (e.keyCode == 13) {
        add(e);
    }
});

function add(e: any): void {
    e.preventDefault();
    let choice: any = choiceField;
    let messageLength: number = choice.val().replace(/ /g, '').length;
    if (messageLength > 0) {
        choices.push(choice.val())
        updatePage(choice);
        var width: number = $(window).width();
        if (width>768) {
            alertify.success('Choice Added!');
        }
    } else {
        choiceField.blur();
        retryInput();
    }
}

function retryInput(): void {
    swal({
        title: "Your choice is blank ...",
        text: "Please type in a choice.",
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "OK"
    });
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
    choiceField.blur();
    chooseText.hide();
    spin.show();
    if (choices.length <= 1) {
        swal({
        title: "You don't have enough choices ...",
        text: "Please add more choices.",
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "OK"
    });
    } else {
        addChoice[0].style.pointerEvents = 'none';
        choose[0].style.pointerEvents = 'none';
        getRandomNumberFromAPI(choices.length, function (number: number): void {
            let choiceIndex: number = number - 1;
            getNumberTriviaFromAPI(number, function (fact: any): void {
                // Present the data
                let chosenNumber: string = 'Choice #' + number + ' has been chosen:\t';
                let chosenChoice: string = choices[choiceIndex];
                let chosenFact: string = fact.text;
                choiceField.blur();
                showChoiceAndFact(chosenNumber, chosenChoice, chosenFact);
                cleanUp();
                addChoice[0].style.pointerEvents = 'auto';
                choose[0].style.pointerEvents = 'auto';
            });
        });
    }
}

function showChoiceAndFact(chosenNumber: string, chosenChoice: string, chosenFact: string): void {
    swal({
        title: chosenNumber + chosenChoice,
        text: 'Fun Fact:\t' + chosenFact,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "OK"
    });
}

function cleanUp(): void {
    choices = [];
    choiceListContainer.html('');
    choiceField.val('');
    chooseText.show();
    spin.hide();
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