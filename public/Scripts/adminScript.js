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
                    '<div class="col userField" id="passwordCol"></div>' +
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
    let inputID = $(this).attr('id');
    let newValue = $(this).val();
    let usernameVal = $(this).parent().parent().parent().attr('id');
    $.post('/people/'+usernameVal,
            {
            fieldName: inputID,
            fieldVal: newValue,
            username: usernameVal
            },
        function(response){
            alert(response);
        });
});