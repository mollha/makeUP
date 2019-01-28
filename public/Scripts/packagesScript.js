$(document).ready(function()
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

    $("header .navbar .dropdown-menu a").click(function () {
        const id = $(this).text().toLowerCase();
        setActiveTab(id+'Tab');
    });

    function hidePackageContent(){
        $("main #packagesPageContent .tab-content .tabContentPanel2").hide();
        $("main #packagesPageContent .tab-content .findOutMore").show();
    }

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
});