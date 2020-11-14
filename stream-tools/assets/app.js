JF.initialize({apiKey: "8471788e5182df01cf109eb4fa8acb2f"});

formID = 202756478593065

function tickermarquee(){
    JF.getFormSubmissions(formID,{
        limit: 200 // filter
    }, function(response){
        /**
         successful response including submissions of form with given id
        .
        */
        var j = 0
        for(var i=0; i<response.length; i++){

            myObj = JSON.parse(response[i].answers["10"].answer.paymentArray);
            total = myObj.total;

            if (i == 0){
                $("#donors").html("");
            };

            if (total > 0){
                $("#donors").append("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+(response[i].answers["5"].answer.first).replace(/(\r\n|\n|\r)/gm,"")+": $"+total);
                j++
            };
            
        }
        duration = j * 1000;
        
        $('.marquee').marquee({
            //speed in milliseconds of the marquee
            duration: duration,
            //gap in pixels between the tickers
            gap: 0,
            //time in milliseconds before the marquee will start animating
            delayBeforeStart: 0,
            //'left' or 'right'
            direction: 'left',
            //true or false - should the marquee be duplicated to show an effect of continues flow
            duplicated: true
        });
    });
};

tickermarquee();
setInterval(tickermarquee, 900000);