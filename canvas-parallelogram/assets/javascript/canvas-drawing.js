+(function(root, $, window, document, undefined) {
    root = root || this;

    var
        config             = {
            canvasEl: '#drawing-canvas',
        },

    CanvasDrawing = function(obj) {
        // If already instance return
        if (obj instanceof CanvasDrawing) { return obj; }
        // Otherwise creates new instance
        if (!(this instanceof CanvasDrawing)) { return new CanvasDrawing(obj); }

        // for chaining
        this._wrapped = obj;
    },

    _initDom = function() {
        $(function() {
            config.$canvasEl = $(config.canvasEl);
        });
    },

    // Any call to subordinate initialization function goes here
    _initialize = function() {
        _initDom();
    };

    // Intialize
    _initialize();

    // Create yerself
    root.CanvasDrawing = CanvasDrawing;

    // Version of our library
    CanvasDrawing.VERSION   = '0.0.1';

    // Support for AMD/RequireJS
    // If define function deefined and its amd
    if (typeof define === 'function' && define.amd) {
        // Define Scandio
        define('CanvasDrawing', function() {
            // and return the library
            return CanvasDrawing;
        });
    }
}(this, jQuery, window, document, undefined));