/// <reference path="typings/index.d.ts" />
declare function getRandomNumberFromAPI(choiceLength: number, callback: any):void;
declare function getNumberTriviaFromAPI(number: number, callback: any):void;
declare function swal(title: string):void;
declare function swal(title: string, body: string):void;

var choices: string[] = []

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

function add (e: any): void {
    e.preventDefault();
        let choice: any = $('#choice-field');
        let messageLength: number = choice.val().replace(/ /g,'').length;
        if ( messageLength >0) {
            choices.push(choice.val())
            updatePage(choice);
        } else {
            swal('Please type in a choice');
        }
}

function updatePage(choice: any): void {
    $('#choice-list-container').append('<p id=\'list-preview' + choices.length + '\' class=\'btn btn-info\' >' + choice.val() + '</p>');
    $('#list-preview' + choices.length).hide();
    $('#list-preview'  + choices.length).fadeIn(500);
    $('#list-preview'  + choices.length).css('visibility', 'visible');
    choice.val('');
}

function decide(e: any): void {
    e.preventDefault();
    if (choices.length <= 1) {
        swal('Please add more than 1 choices to choose from.');        
    } else {
        getRandomNumberFromAPI(choices.length, function (number: number) {
            let choiceIndex: number = number-1;
            getNumberTriviaFromAPI(number, function (fact: any) {
                // Present the data
                let chosenNumber: string = 'Choice number '+ number + ' has been chosen:\t';
                let chosenChoice: string = choices[choiceIndex];
                let chosenFact: string = fact.text;
                swal(chosenNumber + chosenChoice,'Fun Fact:\t' + chosenFact);
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