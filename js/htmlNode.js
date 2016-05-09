  function Node(){
    this.nodeName = '';
    this.classList = [];
    this.id = '';
    this.body = '';
    this.children = [];
    this.parent = '';
    this.addChildren = function(n){
      this.children.push(n);
    }
  }
  idMap = {};
  tagMap = {};
  classMap = {};

  function createNodesTree(domNode){
    var newNode = new Node();
    newNode.nodeName = domNode.nodeName.toLowerCase();
    if(domNode.className != ""){
      newNode.classList = (domNode.className).split(" ");
      for (var i = 0; i < newNode.classList.length ;i++) {
        if(!(newNode.classList[i].toLowerCase() in classMap)){
          classMap[newNode.classList[i].toLowerCase()] = [];
        }
       classMap[newNode.classList[i].toLowerCase()].push(newNode);
      }
    }
    newNode.id = domNode.id;
    newNode.body = domNode;
    newNode.children = [];
    if(newNode.id !="" ){
      idMap[newNode.id]=newNode;
    }
    if(newNode.nodeName != 'script'){
      if(!(newNode.nodeName.toLowerCase() in tagMap)){
        tagMap[newNode.nodeName.toLowerCase()] = [];
      }
      tagMap[newNode.nodeName.toLowerCase()].push(newNode);
    }
    for (var i =0 ; i < domNode.children.length; i++) {
       if(domNode.children[i].nodeName != 'script'){
         var child = createNodesTree(domNode.children[i]);
         child.parent = newNode;
        newNode.addChildren(child);
       }
        
    }
    return newNode;
    if(domNode.children.length == 0){
       
    }
   
  }

  function getElementByID(id){
    return idMap[id];
  }

  function getElementsByTag(tag){
    //  we have to check whether its a (comma seperated classes) query or space seperated
    // for comma -> we have to return all the nodes
    // for space -> we have to return child nodes of parent element
    var tagList = [], commaflag = false;
    // lets say classes = 'abc'
    // on split by comma, list always will going to have length of 1, so we will check if it is less than 2
    // on split by space, list will have length of 1
    if((tag.replace(/[ ]+/g,'').split(',')).length < 2 && tag.replace(/[ ]+/g,' ').split(' ').length > 1){
      tagList = tag.replace(/[ ]+/g,' ').split(' ');
      commaflag = false; // split is on spaces
    }else{
       tagList = tag.replace(/[ ]+/g,'').split(',');
       commaflag = true; // split is on comma
    }


    // for comma separated tags
    if(commaflag){
      var res = {};
      for (var i = tagList.length - 1; i >= 0; i--) {
        res[tagList[i]] = tagMap[tagList[i]];
      }    
    }
    // for space seperated tags -> parent children
    // right to left check for tags
    if(!commaflag){
      var res = [];
      var currentTag = tagList[tagList.length - 1];
      var filtredTagList = tagMap[currentTag] ? tagMap[currentTag] : [];
      for (var i = 0; i < filtredTagList.length; i++) {
        // console.log(filtredTagList[i])
       var flag = searchTag(filtredTagList[i], tagList);
        if(flag){
          res.push(filtredTagList[i]); 
        }
      } 
    }
    return res;
  }

  function searchTag(node, tagList){
    if(tagList.length == 0){
      return true;
    }
    else if(node.nodeName == tagList[tagList.length - 1]){
      return searchTag(node.parent, tagList.slice(0, tagList.length-1));
    }else{
      return false;
    }
  }

  // search by class
  function getElementsByClass(classes){
    //  we have to check whether its a (comma seperated classes) query or space seperated
    // for comma -> we have to return all the nodes
    // for space -> we have to return child nodes of parent element
    var classList = [], commaflag = false;
    // lets say classes = 'abc'
    // on split by comma, list always will going to have length of 1, so we will check if it is less than 2
    // on split by space, list will have length of 1
    if((classes.replace(/[ ]+/g,'').split(',')).length < 2 && classes.replace(/[ ]+/g,' ').split(' ').length > 1){
      classList = classes.replace(/[ ]+/g,' ').split(' ');
      commaflag = false; // split is on spaces
    }else{
       classList = classes.replace(/[ ]+/g,'').split(',');
       commaflag = true; // split is on comma
    }
    if(commaflag){
      var res = {};
      for (var i = classList.length - 1; i >= 0; i--) {
        res[classList[i]] = classMap[classList[i]];
      }   
      return res;
    }
    else{
      return;
    }
  }


  function myFunction() {
    var n =  createNodesTree(document.body)
    console.log(n);
    console.log(classMap);
  }

  function getID(){
    var val = 'ii';
    console.log("ii node is ",getElementByID(val));
  }
  function getTag(){
    var val = 'div   span'
    console.log(getElementsByTag(val));
  }
  function getClass(){
    var val = 'main';
    console.log(getElementsByClass(val));
  }