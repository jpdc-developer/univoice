/// <reference path="typings/index.d.ts" />
declare function getRandomNumberFromAPI(decisionLength: number, callback: any):void;
declare function getNumberTriviaFromAPI(number: number, callback: any):void;
declare function swal(title: string):void;
declare function swal(title: string, body: string):void;

var decisions = []

$('#AddDecision').click(
    function (e: any): void {
        add(e);
});

$('#Decide').click(
    function (e: any): void {
        decide(e);
});

$('#decision-field').keyup(function (e): void {
    if (e.keyCode == 13) {
        add(e);
    }
});

function add (e: any): void {
    e.preventDefault();
        let decision: any = $('#decision-field');
        let messageLength: number = decision.val().replace(/ /g,'').length;
        if ( messageLength >0) {
            decisions.push(decision.val())
            updatePage(decision);
        } else {
            swal('Please type in a choice');
        }
}

function updatePage(decision: any): void {
    $('#decision-list-container').append('<p id=\'list-preview' + decisions.length + '\' class=\'btn btn-info\' >' + decision.val() + '</p>');
    $('#list-preview' + decisions.length).hide();
    $('#list-preview'  + decisions.length).fadeIn(500);
    $('#list-preview'  + decisions.length).css('visibility', 'visible');
    decision.val('');
}

function decide(e: any): void {
    e.preventDefault();
    if (decisions.length <= 1) {
        swal('Please add more than 1 choices to choose from.');        
    } else {
        getRandomNumberFromAPI(decisions.length, function (number) {
            let decisionIndex: number = number-1;
            getNumberTriviaFromAPI(number, function (fact) {
                // Present the data
                let chosenNumber: string = 'Choice number '+ number + ' has been chosen:\t';
                let chosenChoice: string = decisions[decisionIndex];
                let chosenFact: string = fact.text;
                swal(chosenNumber + chosenChoice,'Fun Fact:\t' + chosenFact);
                cleanUp();
            });
        });
    }
}

function cleanUp(): void {
    decisions = [];
    $('#decision-list-container').html('');
}