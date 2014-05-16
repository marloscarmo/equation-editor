eqEd.SubscriptWrapper = function(symbolSizeConfig) {
	eqEd.Wrapper.call(this, symbolSizeConfig); // call super constructor.
    this.className = "eqEd.SubscriptWrapper";

    this.subscriptContainer = new eqEd.SubscriptContainer(symbolSizeConfig);
    this.subscriptContainer.parent = this;
    this.domObj = this.buildDomObj();
    this.domObj.append(this.subscriptContainer.domObj);
    this.childContainers = [this.subscriptContainer];

    // Set up the width calculation
    var width = 0;
    this.properties.push(new Property(this, "width", width, {
        get: function() {
            return width;
        },
        set: function(value) {
            width = value;
        },
        compute: function() {
            return this.subscriptContainer.width;
        },
        updateDom: function() {
            this.domObj.updateWidth(this.width);
        }
    }));

    // Set up the topAlign calculation
    var topAlign = 0;
    this.properties.push(new Property(this, "topAlign", topAlign, {
        get: function() {
            return topAlign;
        },
        set: function(value) {
            topAlign = value;
        },
        compute: function() {
        	var baseWrapper = null;
        	if (this.index !== 0) {
        		baseWrapper = this.parent.wrappers[this.index - 1];
        	} else {
        		// The subscript wrapper is the first entry in the container.
        		// We want to format it, as if there is a symbol immediately
        		// preceeding it.
        		baseWrapper = new eqEd.SymbolWrapper('a', 'MathJax_MathItalic', this.symbolSizeConfig);
        		baseWrapper.parent = this.parent;
        		baseWrapper.index = 0;
        		baseWrapper.update();
        	}
            return baseWrapper.topAlign;
        },
        updateDom: function() {}
    }));

    // Set up the bottomAlign calculation
    var bottomAlign = 0;
    this.properties.push(new Property(this, "bottomAlign", bottomAlign, {
        get: function() {
            return bottomAlign;
        },
        set: function(value) {
            bottomAlign = value;
        },
        compute: function() {
        	var baseWrapper = null;
            var base = null;
        	if (this.index !== 0) {
        		baseWrapper = this.parent.wrappers[this.index - 1];
                if (baseWrapper instanceof eqEd.SubscriptWrapper) {
                    base = baseWrapper.subscriptContainer;
                } else {
                    base = baseWrapper;
                }
        	} else {
        		// The subscript wrapper is the first entry in the container.
        		// We want to format it, as if there is a symbol immediately
        		// preceeding it.
        		baseWrapper = new eqEd.SymbolWrapper('a', 'MathJax_MathItalic', this.symbolSizeConfig);
        		baseWrapper.parent = this.parent;
        		baseWrapper.index = 0;
        		baseWrapper.update();
                base = baseWrapper;
        	}
            var fontHeightNested = this.symbolSizeConfig.height[this.subscriptContainer.fontSize];
            return this.subscriptContainer.height + baseWrapper.bottomAlign - this.subscriptContainer.offsetTop * fontHeightNested;
        },
        updateDom: function() {}
    }));
};

(function() {
    // subclass extends superclass
    eqEd.SubscriptWrapper.prototype = Object.create(eqEd.Wrapper.prototype);
    eqEd.SubscriptWrapper.prototype.constructor = eqEd.SubscriptWrapper;
    eqEd.SubscriptWrapper.prototype.buildDomObj = function() {
        return new eqEd.WrapperDom(this,
            '<div class="wrapper subscriptWrapper"></div>')
    };
    eqEd.SubscriptWrapper.prototype.clone = function() {
        var copy = new this.constructor(this.symbolSizeConfig);
        copy.subscriptContainer = this.subscriptContainer.clone();
        copy.subscriptContainer.parent = copy;
        copy.domObj = copy.buildDomObj();
        copy.domObj.append(copy.subscriptContainer.domObj);
        copy.childContainers = [copy.subscriptContainer];
        return copy;
    };
})();