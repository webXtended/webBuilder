  function AttributeManager(){

    var count=0, attributes={}, attrOrder = [];

    function getPropertyBlock(){
      var tpl,node;

      tpl=document.getElementById("attrTpl");
      node = tpl.content.cloneNode(true);
      return node.children[0];
    }

    function attributeExists(label){
      return !!attributes[label.trim()];
    }

    function addToAttributes(label,value){
      var attrObj={};
      attrObj.pos = count++;
      attrObj.value = value.trim();
      attrObj.label = label.trim();
      attributes[attrObj.label] = attrObj;
      attrOrder.push(label.trim());
      showAttribute(label, value);
    }

    function maintainAttributes(label, value){
      var attrObj;

      if(attributeExists(label)){
        attrObj = getAttributeObject(label);
        attrObj.value = value.trim();
        updateView(attrObj.label, attrObj.value, attrObj.pos);
      }else{
        addToAttributes(label, value);
      }

    }


    function addAttribute(label, value){

      if(attributeExists(label)){
        updateAttribute(label, value);
      }else{
        node.children[0].innerHTML = label;
        node.children[1].value = value;
        this.propertyPanel.append($(node));
      }


    }

    function removeAttribute(label){
      var pos, attrObj;
      if(attributeExists(label)){
        attrObj = getAttributeObject(label);
        attrOrder.splice(attrObj.pos, 1);
        $(AttributeManager.propertyPanel.children("div.property")[attrObj.pos]).remove();
        attributes[label.trim()] = undefined;
      }
    }


    function getAttributeObject(label){
      var attrObj;
      if(attributeExists(label)){
        attrObj = attributes[label.trim()];
        return attrObj;
      }
    }

    function getAttributeValue(label){
      var attrObj = getAttributeObject(label);
      if(attrObj){
        return attrObj.value;
      }
    }

    function showAttribute(label, value, index){
      var node = $(getPropertyBlock());

      node.children("[data-label]").text(label);
      node.children("[data-value]").val(value);
      if(index){
        $(AttributeManager.propertyPanel.children("div.property")[index]).before(node);
      }else{
        AttributeManager.propertyPanel.append(node);
      }
    }

    function updateView(label, value, index){
      var node = $(AttributeManager.propertyPanel.children("div.property")[index]);
      node.children("[data-value]").val(value);
    }


    function populatePropertyPanel(){
      var i,label,value;

      AttributeManager.propertyPanel.children('div.property').remove();
      for(i=0; i<attrOrder.length; i++){
        label = attrOrder[i];
        value = getAttributeValue(label);
        showAttribute(label, value);
      }
    }


    this.setAttribute = function(label, value){
      maintainAttributes(label, value);
    };

    this.removeAttribute = function(label){
      removeAttribute(label);
    };

    this.getAttribute = function(label){
      return getAttributeValue(label);
    };

    this.renderPropertyPanel = function(){
      populatePropertyPanel();
    };

  }

$().ready(function(){
  AttributeManager.propertyPanel = $("#propPanel");
});
 
  
