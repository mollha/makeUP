$(document).ready()
{
    $('main #bookingScreen .name').change(function(){
        const field = $(this);
        if(field.val()){
            correctField(field);
        }
        else{
            incorrectField(field);
        }
    });

    function correctField(field){
        $(field).css("box-shadow", "0 0 3px rgb(0, 255, 63)");
    }

    function incorrectField(field){
        $(field).css("box-shadow", "0 0 5px rgb(255, 0, 0)");
    }

    $("main #bookingScreen #packages").change(function(){
        const packageName = $(this).val();
        $('#bookingScreen #styles').empty();
        $('#bookingScreen #styles').append(
            '<option disabled selected value>- SELECT -</option>'
        );
        $.get("/packages/" + packageName,
            function (response) {
                for(let styleName in response){
                    let style = response[styleName].style;
                    $('#bookingScreen #styles').append(
                        '<option class="remove" value="'+style+'">'+style+'</option>'
                    );
                }
            });
    });

    $("main #bookingScreen .styles").change(function(){
        const edit = $(this).parent().parent().parent().find('.packageDescriptionContainer');
        const styleName = $(this).val();
        const packageName = $("main #bookingScreen #packages").val();
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
        $("main #bookingScreen #extraPackage").append(
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
            '<form>'+
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
            '</form>'+
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
        loadPackages();
    });

    function loadPackages(){
        $('#bookingScreen .packages').empty();
        $('#bookingScreen .packages').append("<option disabled selected value>- SELECT -</option>");
        $.get('/packages',
            function (response) {
                $.each(response, function(key){
                    $('#bookingScreen .packages').append(
                        '<option class="remove" value="'+key+'">'+key+'</option>'
                    );
                })
        });
    }

    loadPackages();
}
