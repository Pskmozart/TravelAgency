/**
 * Header animation functions
 */

/**
 * On document ready event
 */
$(document).ready(function()
{
    /**
     * Window scroll event listner
     */
    window.addEventListener('scroll', function(e)
    {
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 150, //distance from the window top where to shrink the header
            header = document.querySelector("#header");
            
        //add the shrink class if the distance from the document top is greater that the shrinkOn var
        if (distanceY > shrinkOn && header.className.search("shrink") === -1) 
        {
            header.className = header.className += " shrink";
        } 
        //else, remove the shrink class
        else if(distanceY <= shrinkOn)
        {
            header.className = header.className.replace(" shrink", "");
        }
    });
});

