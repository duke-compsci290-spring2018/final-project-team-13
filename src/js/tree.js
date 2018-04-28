var Node = function Node(id, name, url) {

    this.id = id;
    this.name = name;
    this.image = url;
    this.level = 0;
    this.children = [];
    this.parent = null;

    this.setParentNode = function(node) {
        this.parent = node;
    }

    this.getParentNode = function() {
        if(this.parent === null) return false;
        else return this.parent;
    }

    this.addChild = function(node) {
        node.setParentNode(this);
        node.level = this.level + 1;
        this.children[this.children.length] = node;
    }

    this.getChildren = function() {
        if(this.children.length === 0) return false;
        else return this.children;
    }

    this.removeChildren = function() {
        this.children = [];
    }

}

module.exports = Node;

// var root = new Node('root');
// root.addChild(new Node('child 0'));
// root.addChild(new Node('child 1'));
// var children = root.getChildren();
// for(var i = 0; i < children.length; i++) {
//     for(var j = 0; j < 5; j++) {
//         children[i].addChild(new Node('second level child ' + j));
//     }
// }
// console.log(root);
// children[0].removeChildren();
// console.log(root);
// console.log(root.getParentNode());
// console.log(children[1].getParentNode());
