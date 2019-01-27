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
    // $.ajax({
    //     method: "post",
    //     url: '/people',
    //     contentType: 'application/json',
    //     beforeSend: (xhr) =>{xhr.setRequestHeader('access_token','concertina')},
    //     data: JSON.stringify({
    //         username: $('#signUpForm #usernameField').val(),
    //         forename: $('#signUpForm #forenameField').val(),
    //         surname: $('#signUpForm #surnameField').val()
    //     }),
    //     success: function(response){
    //         alert('it worked');
    //     },
    // });
    $.ajax({
        type: 'post',
        url: '/people',
        data: {
            username: $('#signUpForm #usernameField').val(),
            forename: $('#signUpForm #forenameField').val(),
            surname: $('#signUpForm #surnameField').val()
        },
        xhrFields: {
            withCredentials: false
        },
        headers: {
            'access_token': 'concertina'
        },
        success: function (data) {
            console.log('Success');
            console.log(data);
        },
        error: function () {
            console.log('We are sorry but our servers are having an issue right now');
        }
    });
});
/*function(){
    $.ajax({
        url: '/people',
        contentType: 'application/json',
        headers: {"Authorization": localStorage.getItem('token')},
        success: function(response){
            $.each(response, function(key){

            });
        }
    }
}
*/