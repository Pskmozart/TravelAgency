/**
 * Widget object constructor
 * @param {object} opt      - widget options object
 * @param {array} itemsData - objects array of the data to display
 * @returns {undefined} 
 */
function ItemsDisplayWidget(opt, itemsData) 
{
    'use strict'; //strict js mode
    
    //**************************************************************************
    // PROPERTIES/VARS
    //**************************************************************************
    
    /**
     * Private general vars
     */
    var self = this,
        widgetContainer,                //widget container div element
        boxTemplate,                    //item box original and unmodified template (to get via ajax)
        bootstrapClasses = {            //available html/css classes for the box modes (list and grid)
            grid: "itemGridMode",
            list: "itemListMode"
        },
        bootstrapClassesIcons = {       //available html/css FontAwesome icons classes for the switch mode btn (list and grid)
            grid: "fa fa-th-list",
            list: "fa fa-th-large"
        },
        selectedBootstrapClass = bootstrapClasses.grid;     //default selected mode class
        
    
    
    /**
     * Options defaults
     */
    var defaults = {
        parent 		: 'body',               //parent DOM id, class or tagName
        widgetDiv 	: 'ItemsDisplayWidget', //ID of the widget container <div>
        mode            : 'grid',               //initial display mode
        widgetTitle     : ''                    //title bar name to display
    };

    
    
    /**
     * Public properties/vars
     */
    self.itemsData = [];    //items objects array (derived from JSON),
    self.options;           //widget options
    
    

    //**************************************************************************
    // INITIALIZATION
    //**************************************************************************
    
    /**
     * Self-executable pseudo-contructor for the object
     * @return {undefined}
     */
    (function Init()
    {
        //create options modifying the defaults with the passed in the arugment object (optional)
        if (opt && typeof opt === 'object') 
        { 
            //checks if there is an argument being received and it is an object
            self.options = SetOptions(defaults, opt);
        }
        else if (!opt || opt !== 'object')
        { 
            //if there's no argument passed OR no object (with the options) is passed as argument, the defaults are used
            self.options = defaults;
        }
        
        //set the items data
        if(itemsData && Array.isArray(itemsData))
        {
            self.itemsData = itemsData;
        }
        
        //set the initial displaying mode
        selectedBootstrapClass = bootstrapClasses[self.options.mode];
        
        //get the base element and strat the items boxes creation
        CheckParent();
    })();
    
    

    //**************************************************************************
    // METHODS
    //**************************************************************************
    
    /**
     * Check if the parent element is valid and start the widget construction
     * @return {undefined}
     */
    function CheckParent()
    {
        //grabs the DOM element (parent) whose tag, id or class was specified
        var parentDom = document.querySelector(self.options.parent);
        
        //if there is more than one direct child inside the parent element with the same widgetDiv ID as the defined, changes the id
        if (parentDom.querySelectorAll('#'+self.options.widgetDiv).length > 0)
        {
            self.options.widgetDiv = self.options.widgetDiv+self.options.widgetDiv;
            console.log ('To avoid conflicts, change the value of the option "widgetDiv"');
        }
        
        CreateContainer(parentDom); //creates the container div
    }



    /**
     * Create the widget's title bar and container
     * @param {DOM object} parentDom
     * @return {undefined}
     */
    function CreateContainer (parentDom) 
    {
        //create the widget title bar
        var titleBar = CreateDomElement('div', 'itemsTitleBar');
        titleBar.appendChild(CreateDomElement('button', 'itemsModeSwitchBtn ' + bootstrapClassesIcons[self.options.mode]));
        titleBar.appendChild(CreateDomElement('div', 'itemsTitleSeparator'));
        titleBar.appendChild(CreateDomElement('h2', 'itemsTitle', self.options.widgetTitle));
        parentDom.appendChild(titleBar);
        
        //create the widget container itself
    	widgetContainer = document.createElement('div'); //creates the main container div...
    	widgetContainer.id = self.options.widgetDiv;//...and its id...
    	parentDom.appendChild(widgetContainer);//...and appends it to the parent dom element
    	widgetContainer = parentDom.querySelector('#'+self.options.widgetDiv); //selects the created div from the page
        
        //start generating the items
        GenerateItems();
    }
    
    
    
    /**
     * Get the items boxes template and generate each of the items elements 
     * given the corresponding js objects.
     * @return {undefined}
     */
    function GenerateItems()
    {
        //get the template
        $.ajax({
            dataType: "html",
            url: "templates/itemDisplayBox.html"
        })
        .done(function(data) 
        {
            //parse the template to string and save it
            boxTemplate = data.toString();
            
            //iterate through the items array
            for (var i = 0; i < self.itemsData.length; i++) 
            {
                //create an item box
                new Box(self.itemsData[i], i, boxTemplate);
            }
        })
        .fail(function() 
        {
            alert( "An error has ocurred while trying to get the data" );
        });
    }
        
        
        
    /**
     * Change the items display mode (alternating from grid to list and vice-versa)
     * @param {string} oldMode - mode (grid/list) in use before being changed
     * @return {undefined}
     */
    function ChangeDisplayMode(oldMode)
    {
        //get the items (outer) boxes
        var items = document.querySelectorAll(self.options.parent + " ." + self.options.widgetDiv + "Item");

        for (var i = 0; i < items.length; i++) 
        {
            //change the old class by the new one
            items[i].className = 
                    items[i].className.replace(bootstrapClasses[oldMode], bootstrapClasses[self.options.mode]);
        }
    }
        
    
    
    //**************************************************************************
    // OBJECT CONSTRUCTORS
    //**************************************************************************
    
    /**
     * Box objects constructor
     * @param {object} sourceData
     * @param {int} index
     * @param {string} template
     * @returns {undefined}
     */
    function Box(sourceData, index, template)
    { 
        //private vars
        var obj = this;
        
        //public vars/properties
        obj.index = index;
        obj.sourceData = sourceData;
        obj.template = template;



        /**
         * Create the box container, filling the data into the template (pseudo-constructor)
         * @return {undefined}
         */
        (function Init()
        {
            //set the element's variable data to be inserted
            var boxElemData = {
                outerDivClass: self.options.widgetDiv + "Item " + selectedBootstrapClass,
                outerDivId: self.options.widgetDiv + "Item" + obj.index,
                imgSource: obj.sourceData.image,
                title: obj.sourceData.title,
                description: obj.sourceData.description,
                onePaxPriceStyle: obj.sourceData.onePaxPrice ? "" : "display: none",
                onePaxPrice: obj.sourceData.onePaxPrice,
                threePaxPriceStyle: obj.sourceData.threePaxPrice ? "" : "display: none",
                threePaxPrice: obj.sourceData.threePaxPrice,
                morePaxPriceStyle: obj.sourceData.morePaxPrice ? "" : "display: none",
                morePaxPrice: obj.sourceData.morePaxPrice
            }
            
            //Process the template with the data and add the result to the DOM
            widgetContainer.innerHTML += ProcessTemplate(boxElemData);
        })();
        
        
        
        /**
         * Replace the template's "variables" ( {{var}} ) with the given data
         * @param {object} boxElemData
         * @returns {string}
         */
        function ProcessTemplate(boxElemData) 
        {
            //find each property in the html string and replace it with its value
            for (var property in boxElemData) 
            {
                obj.template = obj.template.replace("{{"+property+"}}", boxElemData[property]);
            }

            return obj.template;
        }
    }
    
    
    
    //**************************************************************************
    // EVENTS
    //**************************************************************************
    
    /**
     * Click event for the switch mode (grid/list) button
     */
    $(self.options.parent+" .itemsModeSwitchBtn").click(function()
    {
        var oldMode = self.options.mode;
        
        //alternate between list and grid mode
        self.options.mode = (self.options.mode === "grid" ? "list" : "grid");
        //change icon
        this.className = 
                this.className.replace(bootstrapClassesIcons[oldMode], bootstrapClassesIcons[self.options.mode]);
        
        //change the mode
        ChangeDisplayMode(oldMode);
    });
     
    
    
    //**************************************************************************
    // HELPER METHODS
    //**************************************************************************
    
    /**
     * Helper to simplify the creation of elements
     * @param {string} tag
     * @param {string} classes
     * @param {string} innerHtml
     * @returns {DOM element}
     */
    function CreateDomElement(tag, classes, innerHtml)
    {
        //if the tag is specified
        if(tag) 
        {
            var element = document.createElement(tag);
            
            if(classes)
            { 
                element.className = classes;
            }
            
            if(innerHtml)
            {
                element.innerHTML = innerHtml;
            }
            
            return element;
        }
    }
    
    
    
    /**
     * Join the options set by the user with the remaining defaults
     * @param {object} defaults - object's default values
     * @param {object} opt      - options values supplied at the object creation as argument
     * @return {object}
     */
    function SetOptions(defaults, opt) 
    {
        //iterates through the opt object's properties
        for (var property in opt) 
        {
            if (opt.hasOwnProperty(property)) 
            { 
                //checks its non-inherited properties (which are those indicated at the object's instantiation)
                defaults[property] = opt[property]; //for any properties self were indicated, those with the same name in the defaults object are replaced (including their value)
            }
        }
        
        return defaults; //returns the modified defaults object; the non-supplied properties will remain as defaults
    }
}