$(document).ready();
{
    $('main #bookingScreen .name').change(function(){
        const field = $(this);
        const feedback = $(field).parent().find(".feedback");
        if(field.val()){
            correctField(field);
            field.addClass("true");
            field.removeClass("false");
            feedback.empty();
        }
        else{
            incorrectField(field);
            field.addClass("false");
            field.removeClass("true");
            feedback.html($(field).parent().find("input").attr('id')+" field cannot be blank");
        }
    });

    $("#bookingForm").submit(function(){
        let success = true;
        $(this).find("input").each(function(){
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
    }

    function incorrectField(field){
        $(field).css("box-shadow", "0 0 5px rgb(255, 0, 0)");
    }

    $("main #bookingScreen").on('change', '.packages', function(){
        const packageName = $(this).val();
        const styles = $(this).parent().parent().find('.styles');
        $(styles).empty();
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
        const packageName = $(this).parent().parent().find('.packages').val();
        const edit = $(this).parent().parent().parent().find('.packageDescriptionContainer');
        const styleName = $(this).val();
        $.get("/packages/" + packageName,
            function (response){
                for(let style in response){
                    if(response[style].style === styleName){
                        $(edit).find('.cost').html(response[style].cost);
                        $(edit).find('.time').html(response[style].time);
                    }
                }
            });
    });

    $("main #bookingScreen .packageAdd").click(function(){
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
                        '</div>'+
                    '</div>'+
                    '<div class="row packageBody">'+
                            '<div class="col-sm-4">'+
                                '<label>Package</label>'+
                                '<select name="packages" class="packages">'+
                                    '<option disabled selected value>- SELECT -</option>'+
                                '</select>'+
                            '</div>'+
                            '<div class="col-sm-4">'+
                                '<label>Style</label>'+
                                '<select name="styles" class="styles">'+
                                    '<option disabled selected value>- SELECT -</option>'+
                                '</select>'+
                            '</div>'+
                        '<div class="col-sm-4">'+
                            '<div class="packageDescriptionContainer">'+
                                '<div class="row">'+
                                    '<div class="col">'+
                                        '<span>Cost:</span>'+
                                    '</div>'+
                                    '<div class="col">'+
                                        '<span class="cost"></span>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="row">'+
                                    '<div class="col">'+
                                        '<span>Time:</span>'+
                                    '</div>'+
                                    '<div class="col">'+
                                        '<span class="time"></span>'+
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
}
