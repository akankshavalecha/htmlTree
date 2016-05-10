  function Node(){
    this.nodeName = '';
    this.classList = [];
    this.id = '';
    this.body = '';
    this.children = [];
    this.parent = null;
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

  function getElementById(id){
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
    if(((tag.replace(/[ ]+/g,'').split(',')).length < 2) && (tag.replace(/[ ]+/g,' ').split(' ').length > 1)){
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
      console.log(res)
    }
    // for space seperated tags -> parent children
    // right to left check for tags
    if(!commaflag){
      var res = {};
      var resList = [];
      var currentTag = tagList[tagList.length - 1];
      var filtredTagList = tagMap[currentTag] ? tagMap[currentTag] : [];
      for (var i = 0; i < filtredTagList.length; i++) {
        // console.log(filtredTagList[i])
       var flag = searchTag(filtredTagList[i], tagList);
        if(flag){
          resList.push(filtredTagList[i]); 
        }
      } 
      res[currentTag] = resList;
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


  function getID(){
    var val = 'ii';
    console.log("ii node is ",getElementById(val));
  }
  function getTag(){
    var val = 'div   span'
    console.log(getElementsByTag(val));
  }
  function getClass(){
    var val = 'main';
    console.log(getElementsByClass(val));
  }


function createModal(n){
  // Get the modal
    var modal = document.createElement('div');
    modal.id = 'tree_modal';
    modal.className = 'modal';
    document.body.appendChild(modal);

    // Now create and append to iDiv
    var innerDiv = document.createElement('div');
    innerDiv.className = 'modal-content';
    // The variable iDiv is still good... Just append to it.


    var sp = document.createElement('span');
    sp.className = 'close' ;
    sp.innerHTML = 'X';
    sp.title = 'Close';
    innerDiv.appendChild(sp);

    var p = document.createElement('p');
    p.className = 'col-6';
    // recursion into a tree
    var treehtml = document.createElement('ul');
    createTreeHTML(n, treehtml);
    p.appendChild(treehtml);
    innerDiv.appendChild(p);

    // aside for search tags, id, classes
    var aside = document.createElement('aside');
    aside.className = 'col-6 modal-aside';
    // creating label for input
    var label = document.createElement('label');
    label.innerHTML = 'Search html nodes in the tree:';
    aside.appendChild(label);

    // creating a input for searching nodes
    var inputs = document.createElement('input');
    inputs.type = 'text';
    inputs.name = 'search';
    inputs.id = 'search-input';
    inputs.placeholder = 'Enter to search';
    inputs.addEventListener("keyup", function(e){
      if(e.keyCode === 13){
        searchNodeInTree(this.value);
      }
    });
    aside.appendChild(inputs);

    // creating help text for classes, id, and tags
    var help = document.createElement('p');
    help.className = 'help-block';
    help.innerHTML = "Press Enter to search <br>Use tags to search by tags, eg: div <br> \
                      Use '#' to search tags by id eg: #header \
                      <br> Use: '.' to search by class, eg: .main-header <br>"
    aside.appendChild(help);

    // creatiing a result div for input search 
    var h4 = document.createElement('h4');
    h4.innerHTML = "Search Results: ";
    aside.appendChild(h4);
    var resultDiv = document.createElement('div');
    resultDiv.id = 'resultDiv';
    aside.appendChild(resultDiv);

    innerDiv.appendChild(aside);

    modal.appendChild(innerDiv);


    // When the user clicks on <span> (x), close the modal
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
    }

}

var createTreeHTML = function(rootnode, treehtml) {
    var li = document.createElement('li');
    // span for tag node name
    var name_span = document.createElement('span');
    name_span.title = 'Tag';
    name_span.innerHTML = rootnode.nodeName;
    li.appendChild(name_span);
    // span for id
    var id = rootnode.id ? ' <b> #</b>' + rootnode.id : '';
    var name_span = document.createElement('span');
    name_span.title = 'Class';
    name_span.innerHTML = id;
    li.appendChild(name_span);
    // span for class
    var className = rootnode.classList.length ? ' <b> .</b>'+ rootnode.classList.join(', .') : '';
    var name_span = document.createElement('span');
    name_span.title = 'Id';
    name_span.innerHTML = className;
    li.appendChild(name_span);
    
    // append li in the html
    treehtml.appendChild(li);
    if(rootnode.children.length){
        var subtree = document.createElement('ul');
        li.appendChild(subtree);
        for (var i = 0, length = rootnode.children.length; i < length; i++) {
          createTreeHTML(rootnode.children[i], subtree)
        }
    }
    else{
      return true;
    }

};

var searchNodeInTree = function(val){
  if(val.charAt(0) === '.'){
    res = getElementsByClass(val.replace(/[.]+/g,''));
    var resultDiv = document.getElementById('resultDiv');
    resultDiv.innerHTML = '';
    resultDiv.className = 'results';
    for(item in res){
      for (var i = 0; i < res[item].length; i++) {
        var rdiv = document.createElement('div');
        rdiv.innerHTML = print(res[item][i]) + '<hr>';
        resultDiv.appendChild(rdiv)
      }
    }
  }
  else if(val.charAt(0) === '#'){
    res = getElementById(val.replace(/[#]+/g,''));
    var resultDiv = document.getElementById('resultDiv');
    resultDiv.className = 'results';
    resultDiv.innerHTML = print(res);
  }
  else{
    res = getElementsByTag(val);
    var resultDiv = document.getElementById('resultDiv');
    resultDiv.innerHTML = '';
    resultDiv.className = 'results';
    for(item in res){
      for (var i = 0; i < res[item].length; i++) {
        var rdiv = document.createElement('div');
        rdiv.innerHTML = print(res[item][i]) + '<hr>';
        resultDiv.appendChild(rdiv)
      }
    }
  }
  
};

var print = function(o){
    var str='';
    var outerD = document.createElement('div');
    for(var p in o){
        var innerD = document.createElement('span');
        if(typeof o[p] == 'string'){
           var v = o[p].length ? o[p] : null;
            innerD.innerHTML = p + ': ' + v +'; </br>';
        }
        else if(p === 'parent'){
            // innerD.innerHTML = p + ': { </br>' + print(o + '}';
            var par = o[p] ? o[p].nodeName : null;
            innerD.innerHTML = p + ': ' + par  + '; </br>';
        }
        if( p === 'children'){
          var c = o.children.length ? o.children.length : 0;
          innerD.innerHTML = p + ': '+ c + '; </br>';
        }
        if( p === 'classList'){
          var className = o.classList.length ? o.classList.join(', ') : null; 
          innerD.innerHTML ='class: '+ className + '; </br>';
        }
        outerD.appendChild(innerD);
    }

    return outerD.innerHTML;
};



  function showHTMLTREE() {
    var n =  createNodesTree(document.body)
    createModal(n);
  }

  function showModal(){
    var modal = document.getElementById('tree_modal');
    modal.style.display = 'block';
  }

  (function() {
    showHTMLTREE();
  })();

  // window.load(function(){
    
  // })