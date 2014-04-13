+(function(root, $, window, document, undefined) {
    root = root || this;

    var
        config = {
            canvasEl: '#drawing-canvas',
            ui: {
                clearEl: '#js--start-over'
            },
            msgEl: '#info-bar',
            circle: {
                radius: 5,
                colorClick: 'red',
                colorCircum: 'yellow'
            },
            triangle: {
                color: 'green'
            }
        },
        state = {
            clicks: [],
            isDragging: false
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
            config.$canvasEl = $(config.canvasEl);
            config.canvasEl = config.$canvasEl.get(0);

            config.$msgEl = $(config.msgEl);

            config.ui.$clearEl = $(config.ui.clearEl);
            config.ui.$clearEl.on('click', function() {
                CanvasDrawing.ui.clear();

                state.clicks = [];
            });

            _initCanvas();
        });
    },

    _initCanvas = function() {
        config.isCanvasSupported = typeof config.canvasEl.getContext === 'function';

        if (config.isCanvasSupported) {
            ctx = config.canvasEl.getContext("2d");

            config.canvasEl.width = config.$canvasEl.width();
            config.canvasEl.height = config.$canvasEl.height();

            config.canvasEl.addEventListener("mouseup", CanvasDrawing.interaction.onCanvasClickUp, false);
            config.canvasEl.addEventListener("mousedown", CanvasDrawing.interaction.onCanvasClickDown, false);
        } else {
            CanvasDrawing.ui.showMessage('nosupport');
        }
    },

    // Any call to subordinate initialization function goes here
    _initialize = function() {
        _initDom();

        initialState = state;
    };

    // Intialize
    _initialize();

    CanvasDrawing.interaction = {};

    CanvasDrawing.interaction.getCanvasCoords = function(e) {
        var x = e.x,
            y = e.y;

        x -= config.$canvasEl.offset().left;
        y -= config.$canvasEl.offset().top;

        return {
            x: x,
            y: y
        };
    };

    CanvasDrawing.interaction.onCanvasClickUp = function(e) {
        var coord = CanvasDrawing.interaction.getCanvasCoords(e);
        document.body.style.cursor = 'default';

        if ( state.isDragging === true ) {
            CanvasDrawing.ui.clear();
            CanvasDrawing.ui.drawFromState();
            state.isDragging = false;
        };

        if ( ! CanvasDrawing.interaction.isExistentCoord(coord) ) {
            CanvasDrawing.ui.drawCircle(coord.x, coord.y, config.circle.radius);
        }
    };

    CanvasDrawing.interaction.onCanvasClickDown = function(e) {
        ctx.globalCompositeOperation = 'source-over';

        var coord       = CanvasDrawing.interaction.getCanvasCoords(e),
            circleCoord = null;

        if ( circleCoord = CanvasDrawing.interaction.isExistentCoord(coord, true) ) {
            state.isDragging = true;
            document.body.style.cursor = 'move';

            CanvasDrawing.ui.deleteCircle(circleCoord.x, circleCoord.y, config.circle.radius + 1);
        }
    };

    CanvasDrawing.interaction.isExistentCoord = function(coord, remove) {
        var inRange = function(target, shot) {
            var
                leftBound  = target - config.circle.radius,
                rightBound = target + config.circle.radius;

            if ( shot > leftBound && shot < rightBound ) { return true; }
            else                                         { return false; }
        };

        for (var i = state.clicks.length - 1; i >= 0; i--) {
            var click = state.clicks[i];

            if ( inRange(click.x, coord.x) && inRange(click.y, coord.y) ) {
                if (remove === true) {
                    state.clicks[i] = undefined;
                    state.clicks = state.clicks.filter(function(n){ return n != undefined });
                };

                return click;
            };
        };

        return false;
    };

    CanvasDrawing.ui = {};

    CanvasDrawing.ui.drawCircle = function(x, y, radius, silent) {
        ctx.globalCompositeOperation = 'source-over';

        if (state.clicks.length >= 3) {
            CanvasDrawing.ui.showMessage('nomoredots');

            return false;
        };

        ctx.fillStyle = config.circle.colorClick;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.closePath();

        ctx.fill();

        if (silent !== true) {
            state.clicks.push({
                x: x,
                y: y,
                radius: radius
            });
        }

        if (state.clicks.length === 3) {
            CanvasDrawing.ui.drawTriangle();
            CanvasDrawing.ui.drawCirumCircle();
        }

        return true;
    };

    CanvasDrawing.ui.deleteCircle = function(x, y, radius){
        ctx.globalCompositeOperation = 'destination-out'

        ctx.arc(x, y, radius, 0, Math.PI * 2, true);

        ctx.fill();
    }

    CanvasDrawing.ui.drawTriangle = function() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = config.triangle.color;

        ctx.beginPath();

        ctx.moveTo(state.clicks[0].x, state.clicks[0].y);
        ctx.lineTo(state.clicks[1].x, state.clicks[1].y);
        ctx.lineTo(state.clicks[2].x, state.clicks[2].y);

        ctx.closePath();
        ctx.stroke();
    }

    CanvasDrawing.ui.drawFromState = function() {
        for (var i = state.clicks.length - 1; i >= 0; i--) {
            var click = state.clicks[i];

            CanvasDrawing.ui.drawCircle(click.x, click.y, config.circle.radius, true);
        }
    }

    CanvasDrawing.ui.drawCirumCircle = function() {

    }

    CanvasDrawing.ui.showMessage = function(title) {
        config.$msgEl.fadeIn().html( config.$msgEl.data(title) );
    }

    CanvasDrawing.ui.hideMessage = function() {
        config.$msgEl.fadeOut();
    }

    CanvasDrawing.ui.clear = function() {
        ctx.clearRect(0, 0, config.canvasEl.width, config.canvasEl.height);
    }

    CanvasDrawing.geometry = {};

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