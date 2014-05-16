eqEd.SubscriptContainer = function(symbolSizeConfig) {
	eqEd.Container.call(this, symbolSizeConfig);
	this.className = "eqEd.SubscriptContainer";

	this.domObj = this.buildDomObj();
    var squareEmptyContainerWrapper = new eqEd.SquareEmptyContainerWrapper(symbolSizeConfig);
    this.addWrappers([0, squareEmptyContainerWrapper]);
    this.offsetTop = 0.75;

    // Set up the left calculation
    var left = 0;
    this.properties.push(new Property(this, "left", left, {
        get: function() {
            return left;
        },
        set: function(value) {
            left = value;
        },
        compute: function() {
        	// remember compute hooks get called.
            return 0;
        },
        updateDom: function() {
            this.domObj.updateLeft(this.left);
        }
    }));

    // Set up the top calculation
    var top = 0;
    this.properties.push(new Property(this, "top", top, {
        get: function() {
            return top;
        },
        set: function(value) {
            top = value;
        },
        compute: function() {
        	var baseWrapper = null;
            if (this.parent.index !== 0) {
                baseWrapper = this.parent.parent.wrappers[this.parent.index - 1];
            } else {
                baseWrapper = new eqEd.SymbolWrapper('a', 'MathJax_MathItalic', this.symbolSizeConfig);
                baseWrapper.parent = this.parent.parent;
                baseWrapper.index = 0;
                baseWrapper.update();
            }
            var fontHeight = this.symbolSizeConfig.height[this.fontSize];
            return this.parent.topAlign + baseWrapper.bottomAlign - this.offsetTop * fontHeight;
        },
        updateDom: function() {
            this.domObj.updateTop(this.top);
        }
    }));

    // Set up the fontSize calculation
    var fontSize = "";
    this.properties.push(new Property(this, "fontSize", fontSize, {
        get: function() {
            return fontSize;
        },
        set: function(value) {
            fontSize = value;
        },
        compute: function() {
        	var fontSize = "";
           	var baseWrapper = null;
	        if (this.parent.index !== 0) {
	            baseWrapper = this.parent.parent.wrappers[this.parent.index - 1];
	        } else {
	            // The superscript wrapper is the first entry in the container.
        		// We want to format it, as if there is a symbol immediately
        		// preceeding it.
        		baseWrapper = null;
	        }
	        if (this.parent.parent.fontSize === "fontSizeSmaller" || this.parent.parent.fontSize === "fontSizeSmallest") {
	            fontSize = "fontSizeSmallest";
	        } else {
	            if (baseWrapper instanceof eqEd.SuperscriptWrapper
	             || baseWrapper instanceof eqEd.SuperscriptAndSubscriptWrapper) {
	                fontSize = "fontSizeSmallest";
	            } else {
	                fontSize = "fontSizeSmaller";
	            }
	        }
	        return fontSize;
        },
        updateDom: function() {
            this.domObj.updateFontSize(this.fontSize);
        }
    }));
};

(function() {
    // subclass extends superclass
    eqEd.SubscriptContainer.prototype = Object.create(eqEd.Container.prototype);
    eqEd.SubscriptContainer.prototype.constructor = eqEd.SubscriptContainer;
    eqEd.SubscriptContainer.prototype.buildDomObj = function() {
        return new eqEd.ContainerDom(this,
            '<div class="container subscriptContainer"></div>');
    };
})();