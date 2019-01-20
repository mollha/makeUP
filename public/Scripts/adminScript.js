$("#objectsWrap").on('click', '.userWrap .chevron', function(){
    let section = $(this).parent().parent();
    let username = $(section).attr('id');

    if($(section).hasClass('toggle')){
        $(section).removeClass('toggle');
        $("#objectsWrap #"+username+" .extraDetails").remove();
        $("#objectsWrap #"+username + " .chevron").html('<i class="hover fa fa-chevron-down"></i>');
    }
    else {
        $(section).addClass('toggle');
        $.get("/people/" + username,
            function (user) {
                $(section).append(
                    '<div class="row extraDetails">' +
                    '<div class="col userField" id="forenameCol"><input id="forenameVal" value="'+user.forename+'"></input></div>' +
                    '<div class="col userField" id="surnameCol"><input id="surnameVal" value="'+user.surname+'"></input></div>' +
                    '<div class="col userField" id="passwordCol"></div>' +
                    '</div>'
                );
            });
        $("#objectsWrap #" + username + " .chevron").html('<i class="hover fa fa-chevron-up"></i>');
    }
    });

function ok() {
    $.get("/people",
        function (data) {
            for (let user in data) {
                let username = data[user].username;
                $('#objectsWrap').append(
                    '<div id="'+username+'" class="userWrap">'+
                        '<div class="row">'+
                            '<div class="userIconWrap col-1">'+
                                '<img src="./Images/user.png" alt="User" class="userIcon">'+
                            '</div>'+
                            '<div class="col-10">'+
                                '<span>'+username+'</span>'+
                            '</div>'+
                            '<div class="userIconWrap col-1 chevron">'+
                                '<i class="hover fa fa-chevron-down"></i>'+
                            '</div>'+
                        '</div>'+
                    '</div>'
                );
            }
        });

}

/*
        $('#objectsWrap').append(
            '<div class="usersWrap">'+
                '<div class="row userWrap">'+
                    '<div class="col-3 col-md-2">'+
                        '<img src="./Images/user.png" alt="User" class="adminIcon">'+
                    '</div>'+
                    '<div class="col-6 col-md-8">'+
                        '<div class="headWrap">'+
                            '<h1>Username</h1>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-3 col-md-2">'+
                        '<i class="fa fa-edit adminButton"></i>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            );
    */
ok();