"use strict";function add(e){e.preventDefault();var o=choiceField,t=o.val().replace(/ /g,"").length;if(t>0){choices.push(o.val()),updatePage(o);var n=$(window).width();n>768&&alertify.success("Choice Added!")}else choiceField.blur(),retryInput()}function retryInput(){swal({title:"Your choice is blank ...",text:"Please type in a choice.",showConfirmButton:!1,showCancelButton:!0,cancelButtonText:"OK"})}function updatePage(e){$("#choice-list-container").append("<p id='list-preview"+choices.length+"' class='btn btn-info' >"+e.val()+"</p>"),$("#list-preview"+choices.length).hide(),$("#list-preview"+choices.length).fadeIn(500),$("#list-preview"+choices.length).css("visibility","visible"),e.val("")}function decide(e){e.preventDefault(),choiceField.blur(),chooseText.hide(),spin.show(),choices.length<=1?swal({title:"You don't have enough choices ...",text:"Please add more choices.",showConfirmButton:!1,showCancelButton:!0,cancelButtonText:"OK"}):(addChoice[0].style.pointerEvents="none",choose[0].style.pointerEvents="none",getRandomNumberFromAPI(choices.length,function(e){var o=e-1;getNumberTriviaFromAPI(e,function(t){var n="Choice #"+e+" has been chosen:\t",c=choices[o],i=t.text;choiceField.blur(),showChoiceAndFact(n,c,i),cleanUp(),addChoice[0].style.pointerEvents="auto",choose[0].style.pointerEvents="auto"})}))}function showChoiceAndFact(e,o,t){swal({title:e+o,text:"Fun Fact:\t"+t,showConfirmButton:!1,showCancelButton:!0,cancelButtonText:"OK"})}function cleanUp(){choices=[],choiceListContainer.html(""),choiceField.val(""),chooseText.show(),spin.hide()}function getRandomNumberFromAPI(e,o){$.ajax({url:"https://api.random.org/json-rpc/1/invoke",beforeSend:function(e){e.setRequestHeader("Content-Type","application/json-rpc")},type:"POST",dataType:"json",data:JSON.stringify({jsonrpc:"2.0",method:"generateIntegers",params:{apiKey:"5c868d24-5e66-4927-942f-095abd761219",n:1,min:1,max:e,replacement:!0},id:1})}).done(function(e){try{o(e.result.random.data[0])}catch(t){var n=t.message;swal("An error has occured :( Here is the error message:\n"+n),console.log(n),cleanUp()}}).fail(function(e){var o=e.message;swal("An error has occured :( Here is the error message:\n"+o),console.log(e.getAllResponseHeaders()),console.log(o)})}function getNumberTriviaFromAPI(e,o){var t="http://numbersapi.com/"+e+"/?json";$.ajax({url:t,type:"GET"}).done(function(e){o(e)}).fail(function(e){var o=e.message;swal("An error has occured :( Here is the error message:\n"+o),console.log(e.getAllResponseHeaders()),console.log(o)})}var choices=[],addChoice=$("#add-choice"),choose=$("#choose"),choiceField=$("#choice-field"),choiceListContainer=$("#choice-list-container"),spin=$(".spin"),chooseText=$(".choose-text");$(document).ready(function(){spin.hide()}),addChoice.click(function(e){add(e)}),choose.click(function(e){decide(e)}),choiceField.keyup(function(e){13==e.keyCode&&add(e)});