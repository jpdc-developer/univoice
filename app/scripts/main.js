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
