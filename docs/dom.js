function DOM(){
    var count = 0,
    dom = {}, initNode;

    function getNewNode(){
        var node = {
            node:'',
            id:count++,
            children:{},
            parentId:0,
            attributes:{},
            innerHTML:"",
            seq:0,
            childMaxSeq:0
        }

        return node;
   }

    function getNode(map, id){
        var keys = Object.keys(map), node;
        if(map){
                if(keys.indexOf(id.toString()) !== -1){
                    return map[id];
                }else{
                    for(var i=0; i<keys.length; i++){
                        node = getNode(map[keys[i]].children, id);
                        if(node){break;}
                    }
        }
        }
        return node;
    }

    function getNodeHTML(node, tabCount){
        var html = [];
        tabCount = tabCount || 0;

        html.push("\n");
        tabCount += 1;
        html.push(getTabSpaces());
        html.push(getOpenString(node));
        html.push(getContentString(node));
        html.push("\n");
        html.push(getTabSpaces());
        html.push(getCloseString(node));
        tabCount -= 1;

        function getOpenString(node){
            var openString = [];
             openString.push("<");
             openString.push(node.node);
             openString.push(">");
             return openString.join("");
        }

        function getContentString(node){
            var contentString = [];
            if(Object.keys(node.children).length >0){
                for(var childId in node.children){
                    console.log(tabCount);
                    tabCount += 1;
                    contentString.push(getNodeHTML(node.children[childId], tabCount));
                    tabCount -= 1;
                }
            }else{
                contentString.push(node.innerHTiML);
            }
            return contentString.join("");
        }

        function getCloseString(node){
            var closeString = [];
            html.push("</");
            html.push(node.node);
            html.push(">");
            return closeString.join("");
        }

        function getTabSpaces(){
            var tabs = [];
            for(var i=0; i<tabCount; i++){
                tabs.push(" ");
            }
            return tabs.join("");
        }

        return html.join("");
    }

    function getDomHTML(){
        var html =[];
        for(var child in dom[0].children){
            html.push(getNodeHTML(dom[0].children[child]))
        }
        return html.join("");
    }

    function addNode(parentId, node){
        var parentNode;
/*
        if(parentId === 0){
          parentNode = dom;
        }else{
            parentNode = getNode(dom, parentId);
        }
*/
        parentNode = getNode(dom, parentId);
        node.parentId = parentId;
        parentNode.children[node.id] = node;
        node.seq = parentNode.childMaxSeq?++parentNode.childMaxSeq:0;
   }

   function removeNode(id){
    var node = getNode(dom, id);
    if(node){
        var parentNode = getNode(dom, node.parentId);
        parentNode.children[node.id] = undefined;
        if(id === 0){
            parentNode.children = [];
            $("[data-id="+node.id+"]").children().remove();
        }else{
            $("[data-id="+node.id+"]").remove();
        }
        dom = JSON.parse(JSON.stringify(dom));
    }
    return node;
}

    function initialize(){
    var startNode = getNewNode();
    startNode.node = "root";
    dom[0] = startNode;
   }


   this.add = function(parent, child){
        var parentNode, childNode;
        parentNode = getNode(dom, parseInt(parent.dataset.id, 10));
        childNode = getNewNode();
        childNode.node = child.dataset.tagname.replace("<","").replace(">","");
        $(child).attr("data-id", childNode.id);
        childNode.parentId = parentNode.id;
        addNode(parentNode.id, childNode);


   };

   this.remove = function(id){
        return removeNode(id);
   }

   this.getDom = function(){
        return dom;
   }

   this.getHTML = function(){
       return getDomHTML().trim();
   }

    initialize();
}
