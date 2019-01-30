$(document).ready(function()
{
    //load users on page load
    loadUsers();

    //clicking on the chevron of each user should reveal more information about them
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
                        '<div class="col userField" id="forenameCol"><label for="forename">Forename</label><input id="forename" value="'+user.forename+'"></div>' +
                        '<div class="col userField" id="surnameCol"><label for="surname">Surname</label><input id="surname" value="'+user.surname+'"></div>' +
                        '</div>'
                    );
                });
            $("#objectsWrap #" + username + " .chevron").html('<i class="hover fa fa-chevron-up"></i>');
        }
        });

    //load users into DOM
    function loadUsers() {
        $('#objectsWrap').empty();
        $.get("/people",
            function (data) {
                for (let user in data) {
                    let username = data[user].username;
                    $('#objectsWrap').append(
                        '<div class="usersContainer">'+
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
                            '</div>'+
                            '<div class="bookingSpace"></div>'+
                        '</div>'
                    );
                    $.get("/bookings/"+username,
                        function(response) {
                            for(let booking in response){
                                $('#objectsWrap #'+username).parent().find(' .bookingSpace').append(
                                    '<div id="'+'username'+'Booking" class="bookingWrap">'+
                                        '<div class="row">'+
                                            '<div class="userIconWrap col-1">'+
                                                '<img src="./Images/booking.png" alt="Booking" class="userIcon">'+
                                            '</div>'+
                                            '<div class="col-10">'+
                                                '<span>'+response[booking].packageName+' : '+response[booking].style+'</span>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'
                                );
                            }
                        });
                }
            });
    }

    //when any of the fields are changed, edit the modal and make it appear
    $('#objectsWrap').on('change', '.userWrap input', function(){
        const inputID = $(this).attr('id');
        const newValue = $(this).val();
        const usernameVal = $(this).parent().parent().parent().attr('id');
        $.get("/people/" + usernameVal,
            function (user) {
                $('#modal .modal-body').html('Change <div style="display: inline" id="inputID">'+inputID+'</div> for <strong><div style="display: inline" id="usernameVal">'+usernameVal+'</div></strong> from "<div style="display: inline" id="oldValue">'+user[inputID]+'</div>" to "<div style="display: inline" id="newValue">'+newValue+'</div>"?');
            });
        $('#modal').modal('toggle');
    });

    //save changes, post the new field values
    $('#modal .modal-footer').on('click', '#saveBtn',function(){
        $('#modal').modal('toggle');
        const modalBody = $('#modal .modal-body');
        const usernameVal = $(modalBody).find('#usernameVal').html();
        const inputID = $(modalBody).find('#inputID').html();
        const newValue = $(modalBody).find('#newValue').html();
        $.post('/people/'+usernameVal,
            {
                fieldName: inputID,
                fieldVal: newValue,
                username: usernameVal
            },
    );
        $('#'+usernameVal+' #'+inputID).val(newValue);
    });

    //when the modal is hidden, don't save changes and reset the field to its original value
    $('#modal').on('hide.bs.modal', function(){
        const modalBody = $('#modal .modal-body');
        const usernameVal = $(modalBody).find('#usernameVal').html();
        const inputID = $(modalBody).find('#inputID').html();
        const oldValue = $(modalBody).find('#oldValue').html();
        $('#'+usernameVal+' #'+inputID).val(oldValue);
    });

    //when a new user is created, post to people authentication
    $('#signUpForm').on('submit', function(){
        const errorMessage = $('#createUser #errorMessage');
        $(errorMessage).empty();
        const usernameVal = $('#signUpForm #usernameField').val();
        const forenameVal = $('#signUpForm #forenameField').val();
        const surnameVal = $('#signUpForm #surnameField').val();
        if(usernameVal && forenameVal && surnameVal){
            $.post('/people',{
                    username: usernameVal,
                    forename: forenameVal,
                    surname: surnameVal,
                    access_token: 'concertina'
                });
            loadUsers();
        }
        else{
            $(errorMessage).html('Form fields cannot be left blank');
        }
        return false;
    });

    //when form fields are changed, remove the error message
    $('.form-field').on('change', function(){
        $('#createUser #errorMessage').empty();
    })
});