+function(){
    fs = require('fs');

    /**
     * Trie datastructor's constructor.
     *
     * @param buildFrom a list of items/words to build the structure from.
     */
    var Trie = function(buildFrom) {
        this.paths       = buildFrom;
        this.trie        = {};
        this.doubledPath = false;
    };

    /**
     * Builds the datastructure from scratch.
     *
     * NOTE: Datastructure is not build on construction.
     */
    Trie.prototype.build = function() {
        //Constructs data structure from all passed in items/words
        for (var i = 0, depth = this.paths.length; i < depth; i++) {
            var path      = this.paths[i],
                pathItems = path.split(""),
                at        = this.trie;

            //Works with each single item in one input item e.g. 9 from 911
            for (var j = 0; j < pathItems.length; j++) {
                var pathItem = pathItems[j],
                    restPath = at[pathItem];

                //No node present, need to construct a new leaf
                if (restPath === undefined) {
                    //At end of item
                    if (j === pathItems.length - 1) {
                        at = at[pathItem] = 0;
                    //Left work todo
                    } else {
                        at = at[pathItem] = {};
                    }
                //We have been at this leaf before but need it as an object to continue
                } else if (restPath === 0) {
                    at = at[pathItem] = { _: pathItems.length };

                    this.doubledPath = true;
                //Just write the current item into the current position in the structure
                } else {
                    at = at[pathItem];
                }
            }
        }
    };

    /**
     * Returns a simple string encoded representation of the datastructure.
     *
     * @returns string representing datastructure.
     */
    Trie.prototype.stringify = function() {
        return JSON.stringify(this.trie);
    };

    /**
     * Constructor for processor of phone list.
     *
     * @param filePath string representating file path of input data.
     */
    var Processer = function(filePath) {
        this.filePath     = filePath;
        this.fileContents = {};
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
     * Processes the input data to determine if one number is prefix of another.
     *
     * NOTE: Solely prints output.
     */
    Processer.prototype.process = function() {
        this.read(
            function() {
                //Split up input by lines and strip the number of datasets present
                var input     = this.fileContents.split(/\n/);
                var testCases = input.shift();

                for (i = testCases; i > 0; i--) {
                    //Read chunk size and splice the current set of numbers
                    var numberChunkSize = input.shift();
                    var phoneNumbers    = input.splice(0, numberChunkSize);

                    //Construct and build a tree
                    var trie = new Trie(phoneNumbers);
                    trie.build();

                    //Finally we get to ouput something...
                    if (trie.doubledPath === true) {
                        console.log("NO");
                    } else {
                        console.log("YES");
                    }
                }
            },
            function() {
                console.log('Nothing todo, lazily stopping here.');
            }
        );
    };

    var processor = new Processer('phone.in');

    processor.process();
}();