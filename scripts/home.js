//****************************************************************************** 
// HOME PAGE FUNCTIONS
//****************************************************************************** 

/**
 * Global vars
 */
var tripsOriginalData = [];



//****************************************************************************** 
// DOCUMENT READY EVENT
//****************************************************************************** 

/**
 * Document ready event
 */
$(document).ready(function()
{
    InitHeader();
    
    //get the data
    GetTripsData(
        //callback - execute only after the data is obtained
        InitWidgets
    );
    
    InitFooter();
});



//****************************************************************************** 
// FUNCTIONS
//****************************************************************************** 

/**
 * Get the header template and insert it into the page header element
 * @returns {undefined}
 */
function InitHeader()
{
    //get the header template
    $.ajax({
        dataType: "html",
        url: "templates/header.html"
    })
    .done(function(data) 
    {
        var wrapper = document.querySelector("#header");
        wrapper.innerHTML = data; //add to the dom
    })
    .fail(function() 
    {
        alert( "An error has ocurred while trying to get the data" );
    });
}



/**
 * Get the footer template and insert it into the page footer element
 * @returns {undefined}
 */
function InitFooter()
{
    //get the header template
    $.ajax({
        dataType: "html",
        url: "templates/footer.html"
    })
    .done(function(data) 
    {
        var wrapper = document.querySelector("#footer");
        wrapper.innerHTML = data; //add to the dom
        
        //invoke the grayscale applier jquery plugin if the browser is the Internet Explorer (ONLY) - it has no support for the css filter property
        if(CheckBrowser("msie"))
        {
            //load the style and the script for grayscale manipulation in IE (to avoid unecessary loadings in other browsers)
            $('head').append('<script src="libraries/jquery-gray/jquery.gray.js"></script>');
            //apply the grayscale
            $('.grayscale:not(.grayscale-replaced)')['gray']();
        }
    })
    .fail(function() 
    {
        alert( "An error has ocurred while trying to get the data" );
    });
}



/**
 * Retreive the json data of the available trips and save it
 * @param {function} callback
 * @returns {undefined}
 */
function GetTripsData(callback)
{
    //get the JSON trips' json data 
    $.ajax({
        dataType: "json",
        url: "json/homeData.json"
    })
    .done(function(data) 
    {
        //save the data
        tripsOriginalData = data;
        
        //invoke the callback
        callback.call();
    })
    .fail(function() 
    {
        alert( "An error has ocurred while trying to get the data" );
    });
}



/**
 * Filter the trips by featured or non-featured
 * @param {bool} featured
 * @return {array} - array of filtered data (trips)
 */
function FilterTripsDataByFeatured(featured)
{
    var filteredData = [];
    
    //go through the original data and save only the trips marked as featured 
    for (var i = 0; i < tripsOriginalData.length; i++) 
    {
        if(tripsOriginalData[i].featured == featured)
        {
            filteredData.push(tripsOriginalData[i]);
        }
    }
    
    return filteredData;
}



/**
 * Filter the trips by tag (region)
 * @param {string} tag
 * @return {array} - array of filtered data (trips)
 */
function FilterTripsDataByTag(tag)
{
    var filteredData = []
    
    //go through the original data and save only the trips marked as featured 
    for (var i = 0; i < tripsOriginalData.length; i++) 
    {
        if(tripsOriginalData[i].tag == tag)
        {
            filteredData.push(tripsOriginalData[i]);
        }
    }
    
    return filteredData;
}



/**
 * Initialize the widgets with the filtered data
 * @returns {undefined}
 */
function InitWidgets()
{
    //featured
    new ItemsDisplayWidget({
        parent: "#featured",
        widgetDiv: "featuredTrips",
        mode: "grid",
        widgetTitle: "Featured"
    }, FilterTripsDataByFeatured(1));
    
    //Algarve
    new ItemsDisplayWidget({
        parent: "#algarve",
        widgetDiv: "algarveTrips",
        mode: "list",
        widgetTitle: "Algarve"
    }, FilterTripsDataByTag("Algarve"));
    
    //Alentejo
    new ItemsDisplayWidget({
        parent: "#alentejo",
        widgetDiv: "alentejoTrips",
        mode: "list",
        widgetTitle: "Alentejo"
    }, FilterTripsDataByTag("Alentejo"));
}



//****************************************************************************** 
// HELPER FUNCTIONS
//****************************************************************************** 

/**
 * Check if the current browser is the one given by argument
 * @param {string} browserId
 * @returns {Boolean}
 */
function CheckBrowser(browserId)
{
    if(navigator.userAgent.toLowerCase().indexOf(browserId) > -1 || (browserId === "msie" && !(!navigator.userAgent.match(/Trident.*rv\:11\./)))) //IE 11 exception
    {
         return true;
    }
    
    return false;
}