$(document).ready(function()
{
    const url = new URL(window.location);
    let tab = url.searchParams.get("tab");
    setActiveTab(tab);

    //rearranges content depending on which tab is selected
    function setActiveTab(id) {
        hidePackageContent();
        $('.nav-tabs a[href="#' + id + '"]').tab('show');
        $("main #packagesPageContent #packagesImageHeader img").hide();
        $("#" + id + "Banner" ).show();
    }

    //allows tab navigation via navbar without reloading the full page
    $("header .navbar .dropdown-menu a").click(function () {
        const id = $(this).text().toLowerCase();
        setActiveTab(id+'Tab');
    });

    //hides the bottom section of each tab and reproduces the chevron
    function hidePackageContent(){
        $("main #packagesPageContent .tab-content .tabContentPanel2").hide();
        $("main #packagesPageContent .tab-content .findOutMore").show();
    }

    //clicking between tabs changes content
    $("main #packagesPageContent #tabList .nav-item").click(function (){
        let id = $(this).find('.nav-link').attr('href');
        id = id.substring(1, id.length-3)+'Tab';
        setActiveTab(id);
    });

    //extra content hidden when clicking on the chevron
    $("main #packagesPageContent .tab-content .tabContentPanel2 .fa-chevron-up").click(function (){
        hidePackageContent();
    });

    //clicking on find out more reveals an extra section on each package tab
    $("main #packagesPageContent .tab-content .findOutMore").click(function (){
        $(this).hide();
        $("main #packagesPageContent .tab-content .tabContentPanel2").show();
    });
});