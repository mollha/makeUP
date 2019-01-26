$(document).ready();
{
    $('main #bookingScreen .name').change(function(){
        const field = $(this);
        const feedback = $(field).parent().find(".feedback");
        if(field.val()){
            if(/^[a-zA-Z]+$/.test(field.val())){
                correctField(field);
            }
            else{
                incorrectField(field);
                feedback.html($(field).parent().find("input").attr('id')+" field must only contain letters");
            }
        }
        else{
            incorrectField(field);
            feedback.html($(field).parent().find("input").attr('id')+" field cannot be blank");
        }
    });

    $('main #bookingScreen #Username').change(function(){
        const field = $(this);
        const feedback = $(field).parent().find(".feedback");
        $.get("/people/" + field.val(),
            function (user) {
                if(field.val()){
                    if(/^[a-zA-Z0-9]+$/.test(field.val())){
                        if(!user) {
                            correctField(field);
                        }
                        else {
                            incorrectField(field);
                            feedback.html("Username "+field.val()+" is already taken");
                        }
                    }
                    else{
                        incorrectField(field);
                        feedback.html("Username field must only contain letters or numbers");
                        }
                    }
                else{
                    incorrectField(field);
                    feedback.html("Username field cannot be blank");
                }
            });
    });


    $("#bookingForm").submit(function(){
        let success = true;
        $('#bookingForm').find(".form-field").each(function(){
            let boolean = $(this).hasClass("false");
            if(boolean){
                success = false;
            }
        });
        if(success){
            alert('We can submit');
        }
        else{
            alert('We cannot submit yet');
        }
    });

    function correctField(field){
        $(field).css("box-shadow", "0 0 3px rgb(0, 255, 63)");
        $(field).removeClass("false");
        $(field).parent().find(".feedback").empty();
    }

    function incorrectField(field){
        $(field).css("box-shadow", "0 0 5px rgb(255, 0, 0)");
        $(field).addClass("false");
    }

    $("main #bookingScreen").on('change', '.packages', function(){
        const packageName = $(this).val();
        const styles = $(this).parent().parent().find('.styles');
        $(styles).empty();
        $(styles).addClass("false");
        $(styles).append(
            '<option disabled selected value>- SELECT -</option>'
        );
        $.get("/packages/" + packageName,
            function (response) {
                for(let styleName in response){
                    let style = response[styleName].style;
                    $(styles).append(
                        '<option class="remove" value="'+style+'">'+style+'</option>'
                    );
                }
            });
    });


    $("main #bookingScreen").on('change', '.styles', function(){
        $(this).removeClass('false');
        const packageName = $(this).parent().parent().find('.packages').val();
        const edit = $(this).parent().parent().parent().find('.packageDescriptionContainer');
        const styleName = $(this).val();
        $.get("/packages/" + packageName,
            function (response){
                for(let style in response){
                    if(response[style].style === styleName){
                        $(edit).find('.cost').html('£'+response[style].cost);
                        $(edit).find('.time').html(response[style].time+' min');
                    }
                }
                totalCostAndTime();
            });
    });

    $("main #bookingScreen #extraPackage").on('click','.packageClose',function(){
        $(this).parent().parent().parent().parent().remove();
        if($('#packageSection .packageWrapper').length < 3){
            $('#packageSection .packageAdd').show();
        }
        totalCostAndTime();
    });

    $("main #bookingScreen .packageAdd").click(function(){
        if($('#packageSection .packageWrapper').length >= 2){
            $('#packageSection .packageAdd').hide();
        }
        const extraPackage = $("main #bookingScreen #extraPackage");
        $(extraPackage).append(
            '<div class="row packageWrapper">'+
                '<div class="packageItem select">'+
                    '<div class="row packageHead">'+
                        '<div class="col-2">'+
                            '<img src="./Images/booking.png" class="packageIcon" alt="Package icon">'+
                        '</div>'+
                        '<div class="col-10 packageTitle">'+
                            '<span>Select Package</span>'+
                            '<button type="button" class="close packageClose" aria-label="Close">' +
                                '<span aria-hidden="true">&times;</span>' +
                            '</button>'+
                        '</div>'+
                    '</div>'+
                    '<div class="row packageBody">'+
                            '<div class="col-sm-6 col-md-4">'+
                                '<label>Package</label>'+
                                '<select name="packages" class="packages">'+
                                    '<option disabled selected value>- SELECT -</option>'+
                                '</select>'+
                            '</div>'+
                            '<div class="col-sm-6 col-md-4">'+
                                '<label>Style</label>'+
                                '<select name="styles" class="styles form-field false">'+
                                    '<option disabled selected value>- SELECT -</option>'+
                                '</select>'+
                            '</div>'+
                        '<div class="col-sm-6 col-md-4">'+
                            '<div class="packageDescriptionContainer">'+
                                '<div class="row">'+
                                    '<div class="col">'+
                                        '<span>Cost : </span>'+
                                    '</div>'+
                                    '<div class="col" style="text-align: left">'+
                                        '<span style="padding-left: 5px; text-transform: initial;" class="cost"></span>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="row">'+
                                    '<div class="col">'+
                                        '<span>Time : </span>'+
                                    '</div>'+
                                    '<div class="col" style="text-align: left">'+
                                        '<span style="padding-left: 5px; text-transform: initial;" class="time"></span>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>'
        );
        const newPackage = $(extraPackage).find('.packageWrapper:last-child .packages');
        loadPackages(newPackage);
    });

    function loadPackages(packageList){
        $(packageList).empty();
        $(packageList).append("<option disabled selected value>- SELECT -</option>");
        $.get('/packages',
            function (response) {
                $.each(response, function(key){
                    $(packageList).append(
                        '<option class="remove" value="'+key+'">'+key+'</option>'
                    );
                })
        });
    }
    loadPackages($('#bookingScreen .packageWrapper .packages'));

    function totalCostAndTime(){
        let totalTime = 0;
        let totalCost = 0;
        $('#packageSection .packageWrapper').each(function(){
            let cost = $(this).find('.cost').html();
            let costSubstring = cost.substring(1, cost.length);
            if(costSubstring) {
                totalCost += parseInt(costSubstring);
            }
            let time = $(this).find('.time').html();
            let timeSubstring = time.substring(0, time.length-3);
            if(timeSubstring) {
                totalTime += parseInt(timeSubstring);
            }
        });
        $('.total .totalTime').html('TOTAL TIME: '+totalTime+' min');
        $('.total .totalCost').html('TOTAL COST: £'+totalCost);
    }
}
