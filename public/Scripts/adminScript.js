$(".hover").hover(function () {
    $(this).css({"opacity":"0.7", "cursor":"pointer", "text-decoration": "none"});
}, function () {
    $(this).css({"opacity":"1", "cursor":"default"});
});


function ok() {
    $.get("/people",
        function (data) {
            for (let user in data) {
                console.log(data[user].username)
                $('#objectsWrap').append(
                    '<div class="row userWrap">'+
                        '<div class="col-3 col-md-2">'+
                            '<img src="./Images/user.png" alt="User" class="adminIcon">'+
                        '</div>'+
                        '<div class="col-7 col-md-9">'+
                            '<div class="headWrap">'+
                                '<h1>'+data[user].username+'</h1>'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-2 col-md-1">'+
                            '<i class="fa fa-edit adminButton"></i>'+
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