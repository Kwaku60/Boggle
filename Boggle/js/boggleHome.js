//Global Variables


//Global Implementation
document.getElementById("board-save-and-submit").addEventListener("click", 
    SolveBoggleBoard
);

//Function Definitions 
function SolveBoggleBoard(){

    function SaveBoggleBoard(){
        //Todo: logic for capturing inputs, storing on backend
        console.log("saving");
    }

    //implementatoin using brute force (moved away from this after discovering trie data structure)
    // though checking as you reach three if its  a prefix or the second character is a vowel
    // function SolveBoggleBoard(){

        // 1. grab row one, convert to an array after trimming, ensuring no numbers
        //grab row two- four and do the same.

        //2. create a matrix with the four rows

        //3. assign rules to each box item (directional functions)

        //4. Create a "visited" array for already traversed boxes (storing position in matrix). 
        //This array will be checked before each direction

        //5. looping through based on rown and column. 
            
                //6. check if item exist at adjaent positions and position is not in "visited" array 
                //7. create the permuatations (initial letter + right; initial letter + left; initial letter + diagonal)
                //8. store the permutations in dictionary
                //9.  check again as in step 6
                //10.check if permuations in your dictionary are prefixes or have a vowel as the second item

                //11.if the above is true, check for a match in the dictionary using api
                // continue to traverse directions and add charcters, create further permuations 
                //12.when you reach 16, check for words appearing chronologically via the dictionary app.

        //**the above (6-12)is extremeley long-winded and inefficient, 
        //considering potential for millions of permutations and many repeat instances */
        //potential improvements: a.) implementing an alternative Dijkstra's algorithm for path finding...
        //b.)treading the 4x4 matrix of a board as a graph, and using a graph traversing alg to acess 
        //potential perms, setting rules
        // }

    //****New Approach****//

    //investigated Trie data struct, its use in effficient search, Found an implementation, updated to suit my logic,
    // added comments for my understanding...this method allows for multiple language dictionary usage as base for the trie...

    function EvaluateBoggleBoard(){
        //define trie node class
        var TrieNode = function (parent, value) {
            this.parent = parent;

        //children of the trie node is alphabet, so create array of 26 
            this.children = new Array(26);

            //initialize to false 
            this.isWord = false;
            //if its not the root...
            if (parent !== undefined) {
                //use potential characters
                parent.children[value.charCodeAt(0) - 97] = this;
            }
        };

        //pass an entire english dictionary to the tree 
        var MakeTrie = function (dict) {
            //root has no parent, undefined param
            var root = new TrieNode(undefined, '');

            for (let word of dict.values()) {
                var curNode = root;

                for (var i = 0; i < word.length; i++) {
                    var letter = word[i];
                    var ord = letter.charCodeAt(0);
                    if (97 <= ord < 123) {
                        var nextNode = curNode.children[ord - 97];
                        if (nextNode === undefined) {
                            nextNode = new TrieNode(curNode, letter);
                        }
                        curNode = nextNode;
                    }
                }
                curNode.isWord = true;
            }
            return root;
        };
        var BoggleWords = function (grid, dict, mustHave) {
            var rows = grid.length;
            var cols = grid[0].length;
            var queue = [];
            var words = new Set();
            //loop through columns
            for (var y = 0; y < cols; y++) {
                //loop through rows
                for (var x = 0; x < rows; x++) {
                    var c = grid[y][x];
                    var ord = c.charCodeAt(0);
                    var node = dict.children[ord - 97];
                    if (node !== undefined) {
                        queue.push([x, y, c, node, [[x, y]]]);
                    }
                }
            }
            while (queue.length !== 0) {
                var [x, y, s, node, h] = queue.pop();
                //exploring all of the different potential directions and combinations of characters via position
                for (let [dx, dy] of [[1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1]]) {
                    var [x2, y2] = [x + dx, y + dy];
                    if (h.find(function (el) {
                            return el[0] === x2 && el[1] === y2;
                        }) !== undefined) {
                        continue;
                    }
                    //setting rules for directional movement 
                    if (0 <= x2 && x2 < cols && 0 <= y2 && y2 < rows) {
                        var newHist = h.slice();
                        newHist.push([x2, y2]);
                        var s2 = s + grid[y2][x2];
                        var node2 = node.children[grid[y2][x2].charCodeAt(0) - 97];
                        if (node2 !== undefined) {
                            if (node2.isWord) {
                                if (mustHave === undefined || s2.indexOf(mustHave) !== -1)
                                    words.add(s2);
                            }
                            queue.push([x2, y2, s2, node2, newHist]);
                        }
                    }
                }
            }
            return words.values()
        }

        //function implementation
        //todo- use an api for dictionary instead of hosting locally...
        var dictionarySource = englishDictionary;
        var d = new MakeTrie(dictionarySource);

        //TODO
        // function CollectInputsByRow(row){
        // }
    
        //grab each row from table inputs, hardcoded for now
        let row1 = "abcd"
        let row2 = "efgh"
        let row3 = "ijkl"
        let row4 = "mnop"

        var board = [
            row1,
            row2,
            row3,
            row4,
        ];
        var results = BoggleWords(board, d)
        console.log(results);

        //Todo- loop through results and append to front end

        }
        //implement main functions
        ToggleButtonText();
        EvaluateBoggleBoard();
};

//resources consumed for research/implementation:
    //https://blog.niallconnaughton.com/2015/12/10/solving-boggle-boards-at-scale/
    //https://gist.github.com/JonnoFTW/fbdc5079174c3bb448e0951de9ebbe94


    //https://stackoverflow.com/questions/10021847/for-loop-in-multidimensional-javascript-array
    //https://medium.com/@alexanderv/tries-javascript-simple-implementation-e2a4e54e4330
    //https://www.toptal.com/algorithms/needle-in-a-haystack-a-nifty-large-scale-text-search-algorithm
    //https://medium.com/@paulrohan/matrix-in-javascript-at-the-hacking-school-bootcamp-sum-elements-of-diagonals-of-a-matrix-in-o-n-4f2857028bc0



//further brute force approach gaps:
    //By searching neighbours of neighbours we end up with an exponential algorithm, and we don’t stop trying new letters on the end of the word until we run out of neighbours to try. So, the worst case
    // word candidates will use every letter on the board, in every possible arrangement.



    //General thoughts:
    //lost most of my 3hr time to research and planning, though it all aided in better solution approach overall..