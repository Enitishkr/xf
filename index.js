$( document ).ready(function() {
    
    // hiding fillter Inputs
    $('#dateIdTo').hide();
    $('#dateIdFrom').hide();
    $('#memeId').hide();
    
    // Selecting where to dynamically placing the memes
    var memeOutput = $(".meme-output");

    // Meme Data
    var outputData = [];

    //After Applying Meme Data
    var filterOutputData = [];


    //Get Request
    var GetRequest = ()=>{
        $.ajax({
            type: 'GET',
            url: "https://xmeme-nitish.herokuapp.com/memes/time",
            async: false,
            success: function(data){
                outputData = data;
            }
        });
    }

    //Function ToDisplay Memes
    var DisplayMemes = (MemeData) => {
                    memeOutput.empty();

                    // Diplaying the Memes which are present till Now In Database
                    MemeData.forEach(data => {
                        memeOutput.append('<div class='+data.id+'><div class="Oowner"><span class="OwnerName"><b>'+data.name+'</b></span><br><span class="timeOut">'+data.Dtime+'</span></div><div class="Ocaption">'+data.caption+'</div><div class="memeURL"><img src="'+data.url+'"></div><button class="EditMemeButton">Edit</button></div>');
                    });

                    $(".EditMemeButton").on('click',(event)=>{
                        event.preventDefault();
                        
                            var NewCaption = prompt("Enter New Caption:", event.target.parentNode.childNodes[1].innerText);
                            var NewURL = prompt("Enter New URL:", event.target.parentNode.childNodes[2].childNodes[0].currentSrc);
                            var id = event.target.parentNode.className;
                            var updateData = {};
                            if (NewCaption != null && NewCaption != "" )
                            {
                                updateData.caption = NewCaption;
                            }
                            if(NewURL != null && NewURL != "")
                            {
                                updateData.url = NewURL;
                            }
                            $.ajax({
                                type:'PATCH',
                                url:"https://xmeme-nitish.herokuapp.com/memes/"+id,
                                data:updateData,
                                success: function(response){
                                    GetRequest();
                                    $(".EditMemeButton").off('click');
                                    DisplayMemes(outputData);
                                }
                            })
                    });

    }

    // GET REQUEST For getting the data that is stored in the database
    GetRequest();  
    DisplayMemes(outputData);

    $( "form" ).on('submit',( event ) => {  
                    event.preventDefault();   
                    
                    var data={};
                    data.name = $("#owner").val();
                    data.url = $("#mUrl").val();
                    data.caption = $("#caption").val();
                    
                    //Endpoint for POST REQUEST
                    var endpoits = "https://xmeme-nitish.herokuapp.com/memes?name="+data.name+"&url="+data.url+"&caption="+data.caption;
                    $.ajax({
                        type: 'POST',
                        url: endpoits,
                        async: false,
                        data:data,
                        success: function(data1){
                            GetRequest();
                        }
                    });
                    DisplayMemes(outputData);
                
    });

    $('select').on('change', function() {
            var x = $("#filterType").val();
            if(x == 'searchById')
            {
                // When We Need to Filter Using Id As a Parameter than we will hide input type="date"
                    $('#memeId').show();
                    $('#dateIdTo').hide();
                    $('#dateIdFrom').hide();

                    $("#filterButton").off('click');
                    //Event Listner For Button
                    $("#filterButton").on('click', () => {
                                $.ajax({
                                        type: 'GET',
                                        url: "https://xmeme-nitish.herokuapp.com/memes/"+$("#memeId").val(),
                                        async: false,
                                        success: function(data){
                                                
                                                filterOutputData = data;
                                                DisplayMemes(filterOutputData);
                                                }
                                });
                    });
        
            }
            else if(x == 'searchByName' )
            {
                $("#filterButton").off('click');
                $('#memeId').show();
                $('#dateIdTo').hide();
                $('#dateIdFrom').hide();
                $("#filterButton").on('click', () => {
                            $.ajax({
                                        type: 'GET',
                                        url: "https://xmeme-nitish.herokuapp.com/memes/name/"+$("#memeId").val(),
                                        async: false,
                                        success: function(data){
                                            filterOutputData = data;
                                            DisplayMemes(filterOutputData);
                                        }
                            });
                });
            }
            else if(x == 'timeInterval')
            {
                    $("#filterButton").off('click');
                    $('#memeId').hide();
                    $('#dateIdTo').show();
                    $('#dateIdFrom').show();

                    //   $("#filterButton").on('click', () => {
                        
                    //     var startDate = $('#dateIdFrom').val();
                    //     var endDate = $('#dateIdTo').val();
                    //     filterOutputData = outputData;
                    //     var resultMemeData = filterOutputData.filter(function (a) {
                    //         var hitDates = a.ProductHits || {};
                    //         // extract all date strings
                    //         hitDates = Object.keys(hitDates);
                    //         // convert strings to Date objcts
                    //         hitDates = hitDates.map(function(date) { return new Date(date); });
                    //         // filter this dates by startDate and endDate
                    //         var hitDateMatches = hitDates.filter(function(date) { return date >= startDate && date <= endDate });
                    //         // if there is more than 0 results keep it. if 0 then filter it away
                    //         return hitDateMatches.length>0;
                    //     });
                    //     console.log(resultMemeData);
                    //         });
            }
            else if(x == 'NoFilter')
            {
                $("#filterButton").off('click');
                $('#memeId').hide();
                $('#dateIdTo').hide();
                $('#dateIdFrom').hide();
                GetRequest();
                DisplayMemes(outputData);
            
            }
    });             
});


// {
//     id: 1,
//     name: "Nitish",
//     url:"https://www.w3schools.com/images/w3schools_green.jpg",
//     caption:"This is nitish",
//     Dtime:'2021/2/5  9:54 am'
// },
