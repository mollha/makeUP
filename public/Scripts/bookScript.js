$(document).ready(function()
{
    //load packages on page load
    loadPackages($('#bookingScreen .packageWrapper .packages'));

    //when a text input field is changed, decide if the input is valid and respond accordingly
    $('main #bookingScreen .name').change(function(){
        const field = $(this);
        const fieldVal = $(this).val();
        const id = $(this).attr('id');
        const feedback = $(field).parent().find(".feedback");
        if(fieldVal){
            if(/^[a-zA-Z]+$/.test(fieldVal)){
                if(id === 'Username'){
                    $.get("/people/" + fieldVal,
                        function (user) {
                            if(!user) {
                                correctField(field);
                            }
                            else{
                                incorrectField(field);
                                feedback.html("Username "+fieldVal+" is already taken");
                            }
                        });
                }
                else {
                    correctField(field);
                }
            }
            else{
                incorrectField(field);
                feedback.html(id + " field must only contain letters");
            }
        }
        else{
            incorrectField(field);
            feedback.html(id +" field cannot be blank");
        }
    });

    //on form submission, check validity of input and post form to bookings
    $("#bookingForm").submit(function(){
        let success = true;
        $('#bookingForm #userDetails').find(".form-field").each(function(){
            let field = $(this);
            if(!$(field).hasClass("true") && !$(field).hasClass("false")){
                success = false;
                incorrectField(field);
                const feedback = $(this).parent().find(".feedback");
                feedback.html($(this).parent().find("input").attr("id") + " field cannot be blank");
            }
            if($(field).hasClass("false")){
                success = false;
            }
        });
        let packageResult = checkValidPackages();
        if(success && packageResult){
            let packageData = [];
            $('#bookingForm #packageSection').find(".form-field").each(function(){
                let style = $(this).val();
                let packageName = $(this).parent().parent().find('.packages').val();
                packageData.push({packageName, style});
            });
            $.post('/bookings',
                {
                    username: $('#bookingForm #userDetails #Username').val(),
                    forename: $('#bookingForm #userDetails #Forename').val(),
                    surname: $('#bookingForm #userDetails #Surname').val(),
                    packages: JSON.stringify(packageData)
                });
            $('#modal').modal('toggle');
        }
        return false;
    });

    //when the success modal is closed reset form
    $('#modal').on('hidden.bs.modal', function () {
        $('#extraPackage').empty();
        $('.feedback').empty();
        const mainPackage = $('.packageItem');
        $(mainPackage).css('box-shadow','none');
        let packages = $(mainPackage).find('.packages');
        let styles = $(mainPackage).find('.styles');
        $(packages).val( $(packages).prop('defaultSelected'));
        $(styles).val( $(styles).prop('defaultSelected'));
        const name = $('.name');
        $(name).val("");
        $(name).removeClass("true");
        $(name).css('box-shadow','none');
        $('.cost').empty();
        $('.time').empty();
        $('.totalCost').html('TOTAL COST:');
        $('.totalTime').html('TOTAL TIME:');
    });

    //check if all of the packages are valid
    function checkValidPackages(){
        let success = true;
        $('#bookingForm #packageSection').find(".form-field").each(function(){
            let boolean = $(this).hasClass("false");
            if(boolean){
                success = false;
                $('#errorMsg').html('Packages must not be left empty');
                $(this).parent().parent().parent().css("box-shadow", "0 0 5px rgb(255, 0, 0)");
            }
        });
        return success;
    }

    //field should light up green and allow form submission if the input is acceptable
    function correctField(field){
        $(field).css("box-shadow", "0 0 5px rgb(0, 255, 63)");
        $(field).removeClass("false");
        $(field).addClass("true");
        $(field).parent().find(".feedback").empty();
    }

    //field should light up red and stop form submission if the input is not acceptable
    function incorrectField(field){
        $(field).css("box-shadow", "0 0 5px rgb(255, 0, 0)");
        $(field).addClass("false");
        $(field).removeClass("true");
        $(field).parent().find(".feedback").empty();
    }

    //retrieve styles when new package is selected
    $("main #bookingScreen #packageSection").on('change', '.packages', function(){
        const packageName = $(this).val();
        const styles = $(this).parent().parent().find('.styles');
        $('#errorMsg').empty();
        $(this).parent().parent().parent().css("box-shadow", "none");
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

    //when a new style is selected retrieve cost and time details
    $("main #bookingScreen").on('change', '.styles', function(){
        $(this).removeClass('false');
        $('#errorMsg').empty();
        $(this).parent().parent().parent().css("box-shadow", "0 0 5px rgb(0, 255, 63)");
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

    //when package close button is selected, update total cost and time and re-insert add package option
    $("main #bookingScreen #extraPackage").on('click','.packageClose',function(){
        $(this).parent().parent().parent().parent().remove();
        if($('#packageSection .packageWrapper').length < 3){
            $('#packageSection .packageAdd').show();
        }
        totalCostAndTime();
        $('#errorMsg').empty();
    });

    //insert new package template when clicking package add button
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

    //load list of packages into package select template
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

    //calculate the total cost and total time of the currently selected packages
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
});