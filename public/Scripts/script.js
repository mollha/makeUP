// Functions
$(document).ready()
{
    function changeBanner(child){
        $("main #packagesPageContent #packagesImageHeader img").hide();
        $("main #packagesPageContent #packagesImageHeader img:nth-child("+child+")").show();
    }
    function hidePackageContent(){
        $("main #packagesPageContent .tab-content .tabContentPanel2").hide();
        $("main #packagesPageContent .tab-content .findOutMore").show();
    }
    function foldSignIn() {
        $("main #signInScreen").animate({"height": "140px"});
        $("main #signInScreen #signInForm #dynamicField").empty();
        $("#signInForm input").css("box-shadow","none");
    }
    function displayBlurScreen() {
        $("main #blurScreen").show();
    }
    function displayBookingForm() {
        displayBlurScreen();
        $("main #bookingScreen").css('display', 'flex');
    }
    function displaySignIn() {
        displayBlurScreen();
        $("main #signInScreen").css('display', 'block');
    }

    function displaySignUp(username) {
        displayBlurScreen();
        $("main #signUpScreen").css('display', 'flex');
        $("main #signUpScreen #signUpForm #username").val(username);
    }

    function hideForms() {
        $("main #bookingScreen").hide(350);
        $("main #signInScreen").hide(350);
        $("main #signUpScreen").hide(350);
        foldSignIn();
        $("main form input").val("");
        $("main #blurScreen").hide();
    }


    function validateSignUp(){
        const username = $("#username").val();
        const forename = $("#forename").val();
        const surname = $("#surname").val();
        if(username && forename && surname){
            $.post("http://127.0.0.1:8090/people",
                {
                    username: username,
                    forename: forename,
                    surname: surname
                },
                function (data) {
                    $('#songresult').html(data);
                });
            hideForms();
            return false;
        }
    }

    $('#signUpForm').submit(validateSignUp);

    // Event handling
    $("#bookBlock").click(displayBookingForm);


    $("header .navbar .dropdown-menu a").click(function () {
        const id = $(this).attr('id');
        const child = parseInt(id[id.length -1]);
        $("main #packagesPageContent .nav-tabs a").removeClass('active');
        $("main #packagesPageContent .nav-tabs li:nth-child("+child+") a").addClass('active');
        $("main #packagesPageContent .tab-content div").removeClass('active show');
        $("main #packagesPageContent .tab-content div:nth-child("+child+")").addClass('active show');
        changeBanner(child);
        hidePackageContent();
    });


    $("main #blurScreen").click(function () {
        hideForms();
    });

    $("header .icons #signInBtn").click(displaySignIn);




    function signInHandler() {
        const usernameInput = $("#usernameSignIn").val();
        const passwordInput = $("#passwordSignIn").val();

        if (usernameInput) {
            //username provided
            $.post("http://127.0.0.1:8090/login",
                {
                    username: usernameInput,
                    password: passwordInput
                },
                function (data) {
                    if (passwordInput) {
                        if (data) {
                            //authenticated
                            alert('this worked');
                            //welcome message "welcome username"?
                            //bring up bookings
                            //send get request asking for bookings which include the correct username
                            //close forms
                        }
                        else {
                            //incorrect password
                            //dropdown saying incorrect password
                        }
                    }
                    else {
                        if (data) {
                            //no such username exists
                            //box glows red
                            $("main #signInScreen #signInForm #usernameSignIn").css("box-shadow", "0 0 5px rgb(255, 0, 0)");
                            $("main #signInScreen").animate({"height": "210px"});
                            $("main #signInScreen #signInForm #dynamicField").html("<span>Username does not exist</span>" +
                                "<button class='btn' id='signUp'>SIGN UP</button>");
                            $("main #signInScreen #signInForm #dynamicField span").css({"color":"#cc0000","text-transform":"initial", "font-size": "12px"})
                        }
                        else {
                            //no password provided but username exists
                            //box glows green
                            $("main #signInScreen #signInForm #usernameSignIn").css("box-shadow", "0 0 5px rgb(0, 255, 63)");
                            //drops down password box
                            $("main #signInScreen").animate({"height": "250px"});
                            $("main #signInScreen #signInForm #dynamicField").html("<label for='password'>Enter Password</label>" +
                                "<input id='passwordSignIn' type='password' placeholder='e.g. mySecretPhrase'>" +
                                "<button type='submit' class='btn hover'>SIGN IN</button>");
                            //include an empty div for adding incorrect label
                        }
                    }
                })
        }
        else {
            //close sign in extension - don't send to server
            foldSignIn();
        }
    }

    let usernameBox = $("main #signInScreen #signInForm #usernameSignIn");
    usernameBox.change(function(){
        foldSignIn();
    });
    usernameBox.focusout(function(){
        $(this).parent().submit();
    });


    //close navbar dropdown on select
    $("header .navbar a").on('click', function () {
        $('header .navbar .navbar-collapse').collapse('hide');
    });


    $("main #signInScreen #signInForm").on('click', '#signUp', function(){
        const username = $("#usernameSignIn").val();
        hideForms();
        displaySignUp(username);
    });


    $("main #packagesPageContent #tabList .nav-item").click(function (){
        const id = $(this).attr('id');
        changeBanner(parseInt(id[id.length -1]));
        hidePackageContent();
    });
    $("main #packagesPageContent .tab-content .tabContentPanel2 .fa-chevron-up").click(function (){
        hidePackageContent();
    });
    $("main #packagesPageContent .tab-content .findOutMore").click(function (){
        $(this).hide();
        $("main #packagesPageContent .tab-content .tabContentPanel2").show();
    });

    $("main #signInScreen #signInForm").submit(function(){
        signInHandler();
        return false;
    });

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

    $("main #bookingScreen #styles").change(function(){
        const edit = $(this).parent().parent().parent().find('.packageDescriptionContainer');
        const styleName = $(this).val();
        const packageName = $("main #bookingScreen #packages").val();
        $.get("/packages/" + packageName,
            function (response) {
                for(let style in response){
                    if(response[style].style === styleName){
                        $(edit).find('.cost').html(response[style].cost);
                        $(edit).find('.time').html(response[style].time);
                    }
                }
            });
    });


}