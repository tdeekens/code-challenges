+function() {
   fs = require('fs');

   /**
    * Constructor for processor of phone list.
    *
    * @param filePath string representating file path of input data.
    */
    var Processer = function(filePath) {
       this.filePath     = filePath;
       this.fileContents = {};
       this.matrix       = [];
    };

   /**
    * Reads the input data from disc.
    *
    * @param success callback called after successful reading the input.
    * @param error callback called after failing reading the input.
    */
    Processer.prototype.read = function(success, error) {
        var that = this;

        fs.readFile(this.filePath, 'utf8', function(err, data) {
            if (err) { typeof error === 'function' && error.call(that); }
            else     {
                that.fileContents = data;

                typeof success === 'function' && success.call(that);
            }
        });
    };

    /**
    * Parses the input data read from disc
    *
    * @return object containing information represented in raw input data.
    */
    Processer.prototype.parse = function() {
        //Split up input by lines and strip the number of datasets present
        var input  = this.fileContents.split(/\n/);
        var parsed = {};
        var sizes  = input.shift().split(" ");

        parsed.rows    = parseInt(sizes[0]);
        parsed.columns = parseInt(sizes[1]);

        // Shifts, splits and parses and sorts the row and column constraints
        parsed.rowSums    = input.shift()
                            .split(" ")
                            .map(function(x) { return parseInt(x); })
                            .sort(function(a, b) {
                                return b - a;
                            });

        parsed.columnSums = input.shift()
                            .split(" ")
                            .map(function(x) { return parseInt(x); })
                            .sort(function(a, b) {
                                return b - a;
                            });

        // Parses and sums up the row and column sums
        parsed.rowSum = parsed.rowSums.reduce(function(a, b) {
            return parseInt(a) + parseInt(b);
        });

        parsed.columnSum = parsed.rowSums.reduce(function(a, b) {
            return parseInt(a) + parseInt(b);
        });

        return parsed;
    };

    /**
    * Processes the input data to determine if one number is prefix of another.
    *
    * NOTE: Solely prints output.
    */
    Processer.prototype.isValid = function() {
        this.read(
            function() {
                var parsed = this.parse();

                // Basic constraints e.g. equal row and column sums and space for filling cells before doing math
                if ( parsed.rowSum !== parsed.columnSum || parsed.columnSum > (parsed.rows * parsed.columns) ) {
                    console.log("NO");
                }
                else {
                    if (this.validate(parsed)) {
                        console.log("YES");
                    } else {
                        console.log("NO");
                    }
                }
            },
            function() {
                console.log('Nothing todo, lazily stopping here.');
            }
        );
    };

    /**
    * Validates the matrix constraints.
    *
    * @param parsed input (an object)
    * @return bool indicating outcome of validation
    */
    Processer.prototype.validate = function(parsed) {
        // Substracts n ints from array if possible
        // Returns false when impossible, otherwise the input (from)
        var substract = function(from, amount) {
            for (var i = 0, size = from.length; i < size; i++) {
                // Substraction possible
                if (from[i] > 0) {
                    from[i] -= 1;
                    amount--;
                } else {
                    // Substraction per item only possible once
                    // No more candidates left: return
                    return false
                }

                // Done substracting but need to sort the array for
                // potential next call and return
                if (amount === 0) {
                    return from.sort(function(a, b) {
                        return b - a;
                    });
                }
            }

            // Never reached amount === 0: not enough room to substract: return false
            return false;
        };

        // Iterate columns and try to substract
        for (var i = 0, size = parsed.columnSums.length; i < size; i++) {
            if ( ! substract(parsed.rowSums, parsed.columnSums[i]) ) {
                return false;
            }
        };

        return true;
   };

   var processor = new Processer('tomography1.in');
   processor.isValid();

   var processor = new Processer('tomography2.in');
   processor.isValid();
}();