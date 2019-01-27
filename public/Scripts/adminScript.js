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


function loadUsers() {
    $('#objectsWrap').empty();
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


loadUsers();



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


$('#modal').on('click', '#saveBtn',function(){
    $('#modal').modal('toggle');
    const usernameVal = $('#modal .modal-body').find('#usernameVal').html();
    const inputID = $('#modal .modal-body').find('#inputID').html();
    const newValue = $('#modal .modal-body').find('#newValue').html();
    $.post('/people/'+usernameVal,
        {
            fieldName: inputID,
            fieldVal: newValue,
            username: usernameVal
        },
);
    $('#'+usernameVal+' #'+inputID).val(newValue);
});

$('#modal').on('hide.bs.modal', function(){
    const usernameVal = $('#modal .modal-body').find('#usernameVal').html();
    const inputID = $('#modal .modal-body').find('#inputID').html();
    const oldValue = $('#modal .modal-body').find('#oldValue').html();
    $('#'+usernameVal+' #'+inputID).val(oldValue);
});

$('#signUpForm').on('submit', function(){
    $('#createUser #errorMessage').empty();
    $('.form-field').each(function () {
        let id = $(this).attr('id');
        id = id.substring(0,1).toUpperCase()+id.substring(1, id.length-5);
        let fieldVal = $(this).fieldVal;
        if(!fieldVal){
            $('#createUser #errorMessage').html(id+' cannot be left blank');
        }
    });
    const usernameVal = $('#signUpForm #usernameField').val();
    const forenameVal = $('#signUpForm #forenameField').val();
    const surnameVal = $('#signUpForm #surnameField').val();
    if(usernameVal && forenameVal && surnameVal){
        $.ajax({
            type: 'post',
            url: '/people',
            data: {
                username: usernameVal,
                forename: forenameVal,
                surname: surnameVal
            },
            xhrFields: {
                withCredentials: false
            },
            headers: {
                'access_token': 'concertina'
            },
            success: function (response) {
            },
        });
        loadUsers();
    }
    return false;
});

$('.form-field').on('change', function(){
    $('#createUser #errorMessage').empty();
})