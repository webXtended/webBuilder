function LayoutCreator(){
var createLayoutFromHtml;

createLayoutFromHtml = function(htmlStr){
    var domParser, dParser, rootNode, child, node;

     function createNodes(parent,child){
        var childNode;

        addChild(parent, child);
        childNode = $(parent).find("[data-newnode='true']")[0];
        page.add(parent, childNode);
        $(childNode).removeAttr("data-newnode");

//        page.add(parent, child);


        for(var i=0; i<child.children.length;i++){
//            childNode = child.children[i];
            createNodes(childNode, child.children[i]);
     }

 }

 function addChild(parent, child){
    var node;
            node = createTagBox("<"+ child.tagName.toLowerCase() +">");
//            node.setAttribute("data-tagname",child.tagName.toLowerCase());
            parent.appendChild(node);
 }

    domParser = new DOMParser();
    htmlStr = "<root id='rootNode'>"+htmlStr+"</root>";
    dParser = domParser.parseFromString(htmlStr,"text/html");
    rootNode = dParser.body.children[0];


    for(var i=0; i<rootNode.children.length;i++){
        child = rootNode.children[i];
        createNodes($("#canvas")[0],child);
    }
}


this.createLayoutFromHtml = createLayoutFromHtml;





}