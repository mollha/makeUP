// Functions
$(document).ready()
{
    const url = new URL(window.location);
    let tab = url.searchParams.get("tab");
    setActiveTab(tab);

    function setActiveTab(id) {
        hidePackageContent();
        $('.nav-tabs a[href="#' + id + '"]').tab('show');
        $("main #packagesPageContent #packagesImageHeader img").hide();
        $("#" + id + "Banner" ).show();
    }

    function hidePackageContent(){
        $("main #packagesPageContent .tab-content .tabContentPanel2").hide();
        $("main #packagesPageContent .tab-content .findOutMore").show();
    }

    //close navbar dropdown on selects
    $("header .navbar a").on('click', function () {
        $('header .navbar .navbar-collapse').collapse('hide');
    });

    $("main #packagesPageContent #tabList .nav-item").click(function (){
        let id = $(this).find('.nav-link').attr('href');
        id = id.substring(1, id.length-3)+'Tab';
        setActiveTab(id);
    });

    $("main #packagesPageContent .tab-content .tabContentPanel2 .fa-chevron-up").click(function (){
        hidePackageContent();
    });

    $("main #packagesPageContent .tab-content .findOutMore").click(function (){
        $(this).hide();
        $("main #packagesPageContent .tab-content .tabContentPanel2").show();
    });
}