+(function(root, $, window, document, undefined) {
    // Being able to pass another root
    root = root || this;

    // Local variable to wrapping closure
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
                colorCircum: 'yellow',
                colorParallelogram: 'blue'
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
        npm = {};

    // using dependency from npm with browserify
    npm.circumcenter = require("circumcenter");

    // constructor of module
    CanvasDrawing = function(obj) {
        // If already instance return
        if (obj instanceof CanvasDrawing) { return obj; }
        // Otherwise creates new instance
        if (!(this instanceof CanvasDrawing)) { return new CanvasDrawing(obj); }

        // for chaining
        this._wrapped = obj;
    },

    // initiation relating to dom
    _initDom = function() {
        $(function() {
            // retrieve elements from DOM and cache
            config.$canvasEl = $(config.canvasEl);
            config.canvasEl = config.$canvasEl.get(0);

            config.$msgEl = $(config.msgEl);
            config.ui.$clearEl = $(config.ui.clearEl);

            // bind callback to clear btn
            config.ui.$clearEl.on('click', function() {
                CanvasDrawing.ui.clear();

                state.clicks = [];
            });

            // kick off the canvas
            _initCanvas();
        });
    },

    // initiation of canvas
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

    // Gives the position of the canvas on screen
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

    // Handler for mouseup
    CanvasDrawing.interaction.onCanvasClickUp = function(e) {
        // Get the position of click and reset the cursor
        var coord = CanvasDrawing.interaction.getCanvasCoords(e);
        document.body.style.cursor = 'default';

        // Dragged, so reset canvas and redraw
        if ( state.isDragging === true ) {
            CanvasDrawing.ui.clear();
            CanvasDrawing.ui.drawFromState();
            state.isDragging = false;
        };

        // Clicked on existent coord so
        if ( ! CanvasDrawing.interaction.isExistentCoord(coord) ) {
            CanvasDrawing.ui.drawCircle(coord.x, coord.y, config.circle.radius);
        }
    };

    // Handler for click down, might initiate dragging
    CanvasDrawing.interaction.onCanvasClickDown = function(e) {
        // Draw anyting over existing elements on the canvas
        ctx.globalCompositeOperation = 'source-over';

        var coord       = CanvasDrawing.interaction.getCanvasCoords(e),
            circleCoord = null;

        // Hit an existing coord, needs to be removed
        if ( circleCoord = CanvasDrawing.interaction.isExistentCoord(coord, true) ) {
            // Move to dragging state
            state.isDragging = true;
            document.body.style.cursor = 'move';

            // Erase the coord
            CanvasDrawing.ui.deleteCircle(circleCoord.x, circleCoord.y, config.circle.radius + 1);
        }
    };

    // Checks whether an existing coord has been clicked on
    CanvasDrawing.interaction.isExistentCoord = function(coord, remove) {
        // Helper checking a target and shot with a range
        var inRange = function(target, shot) {
            var
                leftBound  = target - config.circle.radius,
                rightBound = target + config.circle.radius;

            if ( shot > leftBound && shot < rightBound ) { return true; }
            else                                         { return false; }
        };

        // Might have hit any coord on canvas, so loop over existing
        for (var i = state.clicks.length - 1; i >= 0; i--) {
            var click = state.clicks[i];

            // In range
            if ( inRange(click.x, coord.x) && inRange(click.y, coord.y) ) {
                // Remove if flag set
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

    // Draws a click circle - siltent = not added to state
    CanvasDrawing.ui.drawCircle = function(x, y, radius, silent) {
        ctx.globalCompositeOperation = 'source-over';

        // Clicked to often, show message
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

        // Selected three coords, draw geometric shapes now
        if (state.clicks.length === 3) {
            CanvasDrawing.ui.drawTriangle();
            CanvasDrawing.ui.drawCirumCircle();
            CanvasDrawing.ui.drawParallelogram();
        }

        return true;
    };

    // Cuts out a circle from canvas
    CanvasDrawing.ui.deleteCircle = function(x, y, radius){
        ctx.globalCompositeOperation = 'destination-out'

        ctx.arc(x, y, radius, 0, Math.PI * 2, true);

        ctx.fill();
    }

    // Draws the triangle connecting three coords
    CanvasDrawing.ui.drawTriangle = function() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = config.triangle.color;

        ctx.beginPath();

        ctx.moveTo(state.clicks[0].x, state.clicks[0].y);
        ctx.lineTo(state.clicks[1].x, state.clicks[1].y);
        ctx.lineTo(state.clicks[2].x, state.clicks[2].y);

        ctx.closePath();
        ctx.stroke();

        return true;
    }

    // Redraws clicked coords from state
    CanvasDrawing.ui.drawFromState = function() {
        // For all coords
        for (var i = state.clicks.length - 1; i >= 0; i--) {
            var click = state.clicks[i];

            CanvasDrawing.ui.drawCircle(click.x, click.y, config.circle.radius, true);
        }
    }

    // Draws the cirum circle
    CanvasDrawing.ui.drawCirumCircle = function() {
        // Calculate the cc and raduius' location
        var CC = CanvasDrawing.geometry.circumcenter(state.clicks[0], state.clicks[1], state.clicks[2]);
        var CR = CanvasDrawing.geometry.distance(CC, state.clicks[0]);

        ctx.fillStyle = config.circle.colorCircum;

        ctx.beginPath();
        ctx.arc(CC.x, CC.y, 3, 0, Math.PI * 2, true);
        ctx.closePath();

        ctx.fill();

        ctx.lineWidth = 1;
        ctx.strokeStyle = config.circle.colorCircum;

        ctx.beginPath();
        ctx.arc(CC.x, CC.y, CR, 0, Math.PI * 2, true);
        ctx.closePath();

        ctx.stroke();
    }

    // Draws the parallelogram
    CanvasDrawing.ui.drawParallelogram = function() {
        // Get the mirrored point of the longest side
        var mCoord = CanvasDrawing.geometry.mirrorOfLongestSide(state.clicks[0], state.clicks[1], state.clicks[2]);
        drawPoint = function(coord) {
            ctx.fillStyle = config.circle.colorParallelogram;

            ctx.beginPath();
            ctx.arc(coord.x, coord.y, config.circle.radius, 0, Math.PI * 2, true);
            ctx.closePath();

            ctx.fill();
        };

        drawPoint(mCoord);
        drawPoint(mCoord.half);

        ctx.lineWidth = 1;
        ctx.strokeStyle = config.circle.colorParallelogram;

        ctx.beginPath();

        ctx.moveTo(mCoord.x, mCoord.y);
        ctx.lineTo(mCoord.to[0].x, mCoord.to[0].y);

        ctx.moveTo(mCoord.x, mCoord.y);
        ctx.lineTo(mCoord.to[1].x, mCoord.to[1].y);

        ctx.closePath();
        ctx.stroke();

        return true;
    }

    CanvasDrawing.ui.showMessage = function(title) {
        config.$msgEl.fadeIn().html( config.$msgEl.data(title) );
    }

    CanvasDrawing.ui.hideMessage = function() {
        config.$msgEl.fadeOut();
    }

    // Paint over canvas, clears things out
    CanvasDrawing.ui.clear = function() {
        ctx.clearRect(0, 0, config.canvasEl.width, config.canvasEl.height);
    }

    CanvasDrawing.geometry = {};

    // Calculates the mid point of two points
    CanvasDrawing.geometry.midpoint = function(coordA, coordB) {
        return {
            x: ( coordA.x + coordB.x ) / 2,
            y: ( coordA.y + coordB.y ) / 2
        };
    };

    // Calculates the slope and negative reciprocal slope (perpendicular to given vector)
    CanvasDrawing.geometry.slope = function(coordA, coordB) {
        var slope   = ( coordB.y - coordA.y ) / ( coordB.x - coordA.x );
        var nRSlope = -1 / (slope);

        return {
            slope: slope,
            nRSlope: nRSlope
        }
    };

    // Calculates the coord of the circumcenter
    CanvasDrawing.geometry.circumcenter = function(coordA, coordB, coordC) {
        var
            A = [Math.round(coordA.x), Math.round(coordA.y)],
            B = [Math.round(coordB.x), Math.round(coordB.y)],
            C = [Math.round(coordC.x), Math.round(coordC.y)];

        var CC = npm.circumcenter([A, B, C]);

        return {
            x: Math.round(CC[0]),
            y: Math.round(CC[1])
        }
    };

    // Gives the distance of two coords (considers x and y, so new vector)
    CanvasDrawing.geometry.distance = function(coordA, coordB) {
        return Math.round( Math.sqrt(
            Math.pow(coordB.x - coordA.x, 2) +
            Math.pow(coordB.y - coordA.y, 2)
        ));
    };

    // Gives the distance on one axis (say x1 and x2)
    CanvasDrawing.geometry.axisDistance = function(axisA, axisB) {
        return Math.sqrt(Math.pow(axisA - axisB, 2));
    };

    // Mirrors a coord over a given longest side
    CanvasDrawing.geometry.mirrorCoord = function(coords, from , over) {
        // Get the root and the half of the longest side
        var
            flip = coords[ from ],
            half = CanvasDrawing.geometry.midpoint(coords[ over[0] ], coords[ over[1] ]);

        // Calcucate distances of from to half's position and some locational meta info
        var isUnderHalf = flip.y === Math.max(half.y, flip.y),
            isRightOfHalf = flip.x === Math.max(half.x, flip.x),
            distanceXC = CanvasDrawing.geometry.axisDistance(flip.x, half.x),
            distanceYC = CanvasDrawing.geometry.axisDistance(flip.y, half.y);

        // Construct the flipped coord and give half's position and start/end
        return {
            x: isRightOfHalf ? half.x - distanceXC : half.x + distanceXC,
            y: isUnderHalf ? half.y - distanceYC : half.y + distanceYC,
            to: [coords[ over[0] ], coords[ over[1] ]],
            half: half
        };
    };

    // Finds the triangles longest side and mirrors its opposite point
    CanvasDrawing.geometry.mirrorOfLongestSide = function(coordA, coordB, coordC) {
        // Sets up an object of coords for later retrieval
        var
            flippedCoord = {},
            coords = {
                A: coordA,
                B: coordB,
                C: coordC
            };

        coords.A.to = {
            B: CanvasDrawing.geometry.distance(coordA, coordB),
            C: CanvasDrawing.geometry.distance(coordA, coordC)
        };

        coords.B.to = {
            C: CanvasDrawing.geometry.distance(coordB, coordC)
        }

        coords.max = {
            distance: Math.max(coords.A.to.B, coords.A.to.C, coords.B.to.C)
        }

        // Detects the longest side to accordingly flip the independent coord
        if (coords.max.distance === coords.A.to.B) {
            flippedCoord = CanvasDrawing.geometry.mirrorCoord(coords, 'C', ['A', 'B']);
        }
        else if (coords.max.distance === coords.A.to.C) {
            flippedCoord = CanvasDrawing.geometry.mirrorCoord(coords, 'B', ['A', 'C']);
        }
        else {
            flippedCoord = CanvasDrawing.geometry.mirrorCoord(coords, 'A', ['C', 'B']);
        }

        return flippedCoord;
    };

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