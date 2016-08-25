function getRandomNumberFromAPI(numberOfChoices, callback) {
    $.ajax({
        url: "https://api.random.org/json-rpc/1/invoke",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/json-rpc");
        },
        type: "POST",
        dataType: "json",
        data: JSON.stringify(
            {
                "jsonrpc": "2.0",
                "method": "generateIntegers",
                "params": {
                    "apiKey": "5c868d24-5e66-4927-942f-095abd761219",
                    "n": 1,
                    "min": 1,
                    "max": numberOfChoices,
                    "replacement": true
                },
                "id": 1
            }
        ),
        // processData: false
    })
        .done(function (data) {
            // callback(JSON.parse(data)[0].jsonrpc);
            try { 
                callback(data.result.random.data[0]);
            }
            catch(err) {
                swal("An error has occured :( Here is the error message:\n" + err);
                cleanUp();    
            }
        })
        .fail(function (error) {
            pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
            console.log(error.getAllResponseHeaders());
        });
}