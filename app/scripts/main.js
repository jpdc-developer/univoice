var decisions = []

function add() {
    var decision = $('#decision-field');
    var messageLength = decision.val().replace(/ /g,'').length;
    if ( messageLength >0) {
        decisions.push(decision.val())
        updatePage(decision);
    } else {
        swal('Please type in a choice');
    }
}

function updatePage(decision) {
    $('#decision-list-container').append('<p id=\'list-preview\'' + decisions.length + '\' class=\'btn btn-info\' >' + decision.val() + '</p>');
    $('#list-preview' + decisions.length).hide();
    $('#list-preview'  + decisions.length).css('visibility', 'visible');
    $('#list-preview'  + decisions.length).slideDown();
    decision.val('');
}

document.getElementById('decision-field').onkeyup = function(event) {
    if (event.keyCode == 13) {
        add();
    }
}

function decide() {
    if (decisions.length <= 1) {
        swal('Please add more than 1 choices to choose from.');        
    } else {
        getRandomNumberFromAPI(decisions.length, function (number) {
            var fact;
            var decisionIndex = number-1;
            getNumberTriviaFromAPI(number, function (fact) {
                // Present the data
                var chosenNumber = 'Choice number '+ number + ' has been chosen:\t';
                var chosenChoice = decisions[decisionIndex];
                var chosenFact = fact.text;
                swal(chosenNumber + chosenChoice,'Fun Fact:\t' + chosenFact);
                cleanUp();
            });
        });
    }
}

function cleanUp() {
    decisions = [];
    $('#decision-list-container').html('');
}