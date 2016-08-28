/// <reference path="typings/index.d.ts" />
var decisions = [];
$('#AddDecision').click(function (e) {
    add(e);
});
$('#Decide').click(function (e) {
    decide(e);
});
$('#decision-field').keyup(function (e) {
    if (e.keyCode == 13) {
        add(e);
    }
});
function add(e) {
    e.preventDefault();
    var decision = $('#decision-field');
    var messageLength = decision.val().replace(/ /g, '').length;
    if (messageLength > 0) {
        decisions.push(decision.val());
        updatePage(decision);
    }
    else {
        swal('Please type in a choice');
    }
}
function updatePage(decision) {
    $('#decision-list-container').append('<p id=\'list-preview' + decisions.length + '\' class=\'btn btn-info\' >' + decision.val() + '</p>');
    $('#list-preview' + decisions.length).hide();
    $('#list-preview' + decisions.length).fadeIn(500);
    $('#list-preview' + decisions.length).css('visibility', 'visible');
    decision.val('');
}
function decide(e) {
    e.preventDefault();
    if (decisions.length <= 1) {
        swal('Please add more than 1 choices to choose from.');
    }
    else {
        getRandomNumberFromAPI(decisions.length, function (number) {
            var fact;
            var decisionIndex = number - 1;
            getNumberTriviaFromAPI(number, function (fact) {
                // Present the data
                var chosenNumber = 'Choice number ' + number + ' has been chosen:\t';
                var chosenChoice = decisions[decisionIndex];
                var chosenFact = fact.text;
                swal(chosenNumber + chosenChoice, 'Fun Fact:\t' + chosenFact);
                cleanUp();
            });
        });
    }
}
function cleanUp() {
    decisions = [];
    $('#decision-list-container').html('');
}
