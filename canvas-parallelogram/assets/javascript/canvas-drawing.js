+(function(root, $, window, document, undefined) {
    root = root || this;

    var
        config = {
            canvasEl: '#drawing-canvas',
            msgEl: '#info-bar'
        },
        ctx = null,

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
            config.$canvasEl = $(config.canvasEl).get(0);
            config.$msgEl = $(config.msgEl);

            _initCanvas();
        });
    },

    _initCanvas = function() {
        config.isCanvasSupported = config.$canvasEl.getContext;

        if (config.isCanvasSupported) {
            ctx = config.$canvasEl.getContext("2d");
        } else {
            config.$msgEl.fadeIn().html( config.$msgEl.data('nosupport') );
        }
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
    CanvasDrawing.VERSION = '0.0.1';

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