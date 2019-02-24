

var world = function() {
    var self = this;
    self.xLength = 50; // these need to be ... global?
    self.yLength = 50;
    self.keyLeft = 37;
    self.keyRight = 39;
    self.keyUp = 38;
    self.keyDown = 40;

    self.map = new map(this);
    self.player = new player(this);

    self.processClick = function(event) {
        if(event.type ==='click') {
            var xCellClicked = Math.floor(event.offsetX / self.xLength);
            var yCellClicked = Math.floor(event.offsetY / self.yLength);
            if(self.map.canMoveTo(xCellClicked,yCellClicked)) {
                self.player.moveIfCan(xCellClicked,yCellClicked);
            }
            //self.map.processClick(xCellClicked, yCellClicked);
            //self.player.processClick();
        }
        if(event.type === 'keydown') {
            var input = event.which;
            console.log(input);
            var moveToX = self.player.x, moveToY = self.player.y;
            if(input === self.keyLeft) {
                // go left
                moveToX = self.player.x - 1;
            } else if (input === self.keyUp) {
                // go up
                moveToY = self.player.y - 1;
            } else if (input === self.keyRight) {
                // go right
                moveToX = self.player.x + 1;
            }else if (input === self.keyDown) {
                // go down
                moveToY = self.player.y + 1;
            }
            if(self.map.canMoveTo(moveToX,moveToY)) {
                self.player.moveIfCan(moveToX,moveToY);
            }
        }
    }

    self.draw = function(ctx) {
        self.map.draw(ctx);
        self.player.draw(ctx);
    }
}

var player = function(world) {
    var self = this;
    self.world = world;
    self.x = 0;
    self.y = 0;
    self.displayX = 0;
    self.displayY = 0;
    self.xLength = 50; // these need to be ... global?
    self.yLength = 50;
    self.image = new Image();
    self.image.src = "images/player.png";

    self.processClick = function(event) {
            
    }
    self.moveIfCan = function(xClicked, yClicked) {
        if(self.canMoveTo(xClicked,yClicked)) {
            console.log("moving to " + xClicked + "," + yClicked);
            self.x = xClicked;
            self.y = yClicked;
            //self.displayX = self.x * self.xLength;
            //self.displayY = self.y * self.yLength;
            self.animateMove();
            return true;
        }
        console.log("couldn't move too far away (or is where we currently are)");
        return false;
    }
    self.animateMove = function() {
        var moveIncrement = 10;
        var targetX = self.x * self.xLength;
        var targetY = self.y * self.yLength;
        console.log("currently at " + self.displayX + "," + self.displayY + " and aiming for " + targetX + "," + targetY);
        if(targetX !== self.displayX || targetY !== self.displayY) {
            // todo there must be a more succinct way of doing this 
            if(self.displayY < targetY) {
                self.displayY = self.displayY + moveIncrement;
                if(self.displayY > targetY) {
                    self.displayY = targetY;
                }
            }
            if(self.displayY > targetY) {
                self.displayY = self.displayY - moveIncrement;
                if(self.displayY < targetY) {
                    self.displayY = targetY;
                }
            }
            if(self.displayX < targetX) {
                self.displayX = self.displayX + moveIncrement;
                if(self.displayX > targetX) {
                    self.displayX = targetX;
                }
            }
            if(self.displayX > targetX) {
                self.displayX = self.displayX - moveIncrement;
                if(self.displayX < targetX) {
                    self.displayX = targetX;
                }
            }
            
            setTimeout(self.animateMove, 50);
        }
    }
    self.canMoveTo = function(x,y) {
        if(x === self.x && (Math.abs(y - self.y)) === 1) {
            return true;
        }
        if(y === self.y && (Math.abs(x - self.x)) === 1) {
            return true;
        }
        return false;
    }
    self.draw = function(ctx) {
        ctx.save();
        var xCo = self.displayX;// * self.xLength;
        var yCo = self.displayY;// * self.yLength;
        ctx.font = '20px serif';
        ctx.fillStyle = "#05FA07";
        ctx.textBaseline = "top";
        //ctx.fillText("WOW", xCo, yCo);
        ctx.drawImage(self.image, xCo, yCo);
        ctx.restore();
    }
}

var map = function() {
    var self = this;

    self.xLength = 50;
    self.yLength = 50;
    self.rowMax = 12;
    self.colMax = 16;
    self.rows = [];

    self.canMoveTo = function (x, y) {
        if(x < 0 || y < 0 || x > self.colMax -1 || y > self.rowMax -1) return false;
        var cell = self.getCell(x,y);
        console.log("checking to see if this cell can be moved to on the map");
        console.log(cell);
        // property might not be defined; don't return undefined
        if(!('canMoveTo' in cell)){
            console.log("map says you CAN move to this cell cause nothing defined")
            return true;
        }
        if(cell.canMoveTo === true) {
            console.log("map says you CAN move to this cell cause set to true")
            return true;
        }
        console.log("map says you can't move to this cell")
        return false;
    }
    self.getCell = function(x, y) {
        return self.rows[y][x];
    }

    self.processClick = function(x,y) {
        
        var cell = self.getCell(x,y);
        // ???
    }
    self.draw = function(ctx) {
        for(var y=0;y<self.rowMax;y++) {
            for(var x=0;x<self.colMax;x++) {
                ctx.save();
                // todo most of this stuff can be out of the loop; styles are staying the same
                var xCo = x * self.xLength;
                var yCo = y * self.yLength;
                ctx.strokeStyle = "#CFF7CF";
                ctx.strokeRect(xCo, yCo, self.xLength, self.yLength)
                //ctx.moveTo(x * self.xLength, y * self.yLength);
                ctx.font = '20px serif';
                ctx.fillStyle = "#CFF7CF";
                ctx.textBaseline = "top";
                //ctx.fillText(x + "," + y, xCo, yCo);
                var cell = self.getCell(x,y);
                //ctx.fillText(cell.index, xCo, yCo);
                // if the cell has an image then draw it
                if('image' in cell) {
                    ctx.drawImage(cell.image, xCo, yCo)
                }
                ctx.restore();
            }
        }
    }

    self.setupGrid = function() {
        var index = 0;
        for(var y=0;y<self.rowMax;y++) {
            var cols = [];
            for(var x=0;x<self.colMax;x++) {
                cols.push({ x : x , y : y , index : index });
                index++;
            }
            self.rows.push(cols);
        }
    }
    self.setupEverything = function() {
        // setup the basic grid so the arrays are build
        self.setupGrid();
        // populate the arrays with any configuration specified
        for(var i=0;i<cells.length;i++) {
            var cellData = cells[i];

            if('canMoveTo' in cellData){
                self.rows[cellData.y][cellData.x].canMoveTo = cellData.canMoveTo;
            }
            if('imgSrc' in cellData){
                self.rows[cellData.y][cellData.x].image = new Image();
                self.rows[cellData.y][cellData.x].image.src = 'images/'+ cellData.imgSrc;
            }
            
            //self.rows[cellData.y][cellData.x]
        }
        console.log(self.rows);
    }
    self.setupEverything()
}

