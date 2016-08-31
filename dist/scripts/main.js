"use strict";function add(e){e.preventDefault();var n=$("#choice-field"),t=n.val().replace(/ /g,"").length;if(t>0){choices.push(n.val()),updatePage(n);var o=$(window).width();o>768&&alertify.success("Choice Added!")}else retryInput()}function retryInput(){swal({title:"Your choice is blank ...",text:"Please type in a choice.",showConfirmButton:!1,showCancelButton:!0,cancelButtonText:"OK"})}function updatePage(e){$("#choice-list-container").append("<p id='list-preview"+choices.length+"' class='btn btn-info' >"+e.val()+"</p>"),$("#list-preview"+choices.length).hide(),$("#list-preview"+choices.length).fadeIn(500),$("#list-preview"+choices.length).css("visibility","visible"),e.val("")}function decide(e){e.preventDefault(),choices.length<=1?swal({title:"You don't have enough choices ...",text:"Please add more choices.",showConfirmButton:!1,showCancelButton:!0,cancelButtonText:"OK"}):getRandomNumberFromAPI(choices.length,function(e){var n=e-1;getNumberTriviaFromAPI(e,function(t){var o="Choice number "+e+" has been chosen:\t",c=choices[n],i=t.text;showChoiceAndFact(o,c,i),cleanUp()})})}function showChoiceAndFact(e,n,t){swal({title:e+n,text:"Fun Fact:\t"+t,showConfirmButton:!1,showCancelButton:!0,cancelButtonText:"OK"})}function cleanUp(){choices=[],$("#choice-list-container").html(""),$("#choice-field").val("")}function getRandomNumberFromAPI(e,n){$.ajax({url:"https://api.random.org/json-rpc/1/invoke",beforeSend:function(e){e.setRequestHeader("Content-Type","application/json-rpc")},type:"POST",dataType:"json",data:JSON.stringify({jsonrpc:"2.0",method:"generateIntegers",params:{apiKey:"5c868d24-5e66-4927-942f-095abd761219",n:1,min:1,max:e,replacement:!0},id:1})}).done(function(e){try{n(e.result.random.data[0])}catch(t){var o=t.message;swal("An error has occured :( Here is the error message:\n"+o),console.log(o),cleanUp()}}).fail(function(e){var n=e.message;swal("An error has occured :( Here is the error message:\n"+n),console.log(e.getAllResponseHeaders()),console.log(n)})}function getNumberTriviaFromAPI(e,n){var t="http://numbersapi.com/"+e+"/?json";$.ajax({url:t,type:"GET"}).done(function(e){n(e)}).fail(function(e){var n=e.message;swal("An error has occured :( Here is the error message:\n"+n),console.log(e.getAllResponseHeaders()),console.log(n)})}var choices=[];$("#add-choice").click(function(e){add(e)}),$("#choose").click(function(e){decide(e)}),$("#choice-field").keyup(function(e){13==e.keyCode&&add(e)});