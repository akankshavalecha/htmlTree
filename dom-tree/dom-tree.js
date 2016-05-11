// ========================
// javascript file to make a tree structure from a given html
// it will parse the document and build nodes and finally create a tree, having a root link to top level node

// vanilla javascript is used
// no plugin required
// =========================


// =================================
// Node class and methods
// ----------------------

// a node for each dom element
function Node(data){
  this.data = data;
  this.children = [];
  this.parent = null;
}


// to add children to the node
Node.prototype.addChildren = function(n){
  this.children.push(n);
};

// =================================


// =================================
// Tree class and methods
//-----------------------

//  Tree for for dom tree that points to root
function Tree(){
  this._root = null;
}

// global tree object is set for testing and demo
var tree = new Tree();

// a tree method: to create nodes and children and by using recursion, creating a tree
Tree.prototype.createNodesTree = function(domNode){
  // new node is created using DOM element
  var newNode = new Node(domNode);

  // set children and parent by recursion
  for (var i =0 ; i < domNode.children.length; i++) {
    var child = this.createNodesTree(domNode.children[i]); // child node is returned
    child.parent = newNode; // set parent to child node
    newNode.addChildren(child); // node addChildren method is called to add child
  }
  // it is required to set hashtable maps while the children nodes are building
  // set hashtables
  hashtable.setHashTables(newNode);
  return newNode; // finally node is returned
}

// creates a tree structure as html tree
// the tree structure created here, will appendto to treehtml which is sent as params
Tree.prototype.createTreeHTML = function(tree, treehtml) {
  var li = document.createElement('li');
  // span for tag node name
  var name_span = document.createElement('span');
  name_span.title = 'Tag';
  name_span.innerHTML = tree.data.nodeName.toLowerCase();
  li.appendChild(name_span);
  // span for id
  var id = tree.data.id ? '<b>#</b>' + tree.data.id : '';
  var name_span = document.createElement('span');
  name_span.title = 'Id';
  name_span.innerHTML = id;
  li.appendChild(name_span);
  // span for class
  var cl = toArray(tree.data.classList);
  var className = cl.length ? '<b>.</b>'+ cl.join('.') : '';
  var name_span = document.createElement('span');
  name_span.title = 'Class';
  name_span.innerHTML = className;
  li.appendChild(name_span);
  
  // append li in the treehtml
  treehtml.appendChild(li);
  // if tree node has children, the function will iterate recursively and children will be created
  if(tree.children.length){
    // subtree, ul is created and append to parent li
    var subtree = document.createElement('ul');
    li.appendChild(subtree);
    for (var i = 0, length = tree.children.length; i < length; i++) {
      // ul subtree is sent as treehtml along with children
      // another subtree will be created and will append to parent html using subtree
      this.createTreeHTML(tree.children[i], subtree)
    }
  }
  else{
    // if no child found, then it return to append another nodes
    return true;
  }

};

// tree methods ends
// ==================================


// =================================
// Hashtable class
// ---------------

// a hashtable class id defined to keep hashtable
function Hashtable(){
  this.idMap = {}; // id Hash Map for id-node mapping, This keeps a node mapped to id of that node
  this.tagMap = {}; // tag HashMap for tag-node mapping. This keeps the list of nodes mapped to a node name
  this.classMap = {}; // class HashMap for class-node mapping. keeps the list of nodes mapped to a class name
}
// global object is created to access the hashtable
var hashtable = new Hashtable();


// set node in hastables: to be used for search operations by ID, Class, Tags
// this will be called each time a new node is created
// it sets nodes in idMap, tagMap and classMap Hashtables
Hashtable.prototype.setHashTables = function(node){
  // set tagMap
  if(!(node.data.nodeName.toLowerCase() in this.tagMap)){
    this.tagMap[node.data.nodeName.toLowerCase()] = [];
  }
  this.tagMap[node.data.nodeName.toLowerCase()].push(node);

  // set classMap
  if(node.data.classList){
    var nClassList = toArray(node.data.classList);
    for (var i = 0; i < nClassList.length; i++) {
      if(!(nClassList[i].toLowerCase() in this.classMap)){
        this.classMap[nClassList[i].toLowerCase()] = [];
      }
      this.classMap[nClassList[i].toLowerCase()].push(node);
    }
  }

  // set idMap
  if(node.id !="" ){
    this.idMap[node.data.id] = node;
  }
  
};


// process the query list and return type of query: comma based seperation or space based
Hashtable.prototype.cleanQuery = function(query){
  //  we have to check whether its a (comma seperated id) query or space seperated
  // for comma -> we have to return all the nodes
  // for space -> we have to return child nodes of parent element
  // lets say id = 'abc'
  // on split by comma, list always will going to have length of 1, so we will check if it is less than 2
  // on split by space, list will have length of 1
  if((query.replace(/[ ]+/g,'').split(',')).length < 2 && query.replace(/[ ]+/g,' ').split(' ').length > 1){
    // queryList = query.replace(/[ ]+/g,' ').split(' ');
    commaflag = false; // split is on spaces
  }else{
    // queryList = query.replace(/[ ]+/g,'').split(',');
     commaflag = true; // split is on comma
   }
   return commaflag;
};

// hashtable method for node search by id
Hashtable.prototype.getNodeById = function(query){
  // for one id we can use this
  // return idMap[id]; for one id we can use this
  var idList = [], commaflag = false;
  // query is processed for comma seperation ids, or spaces seperated
  commaflag = this.cleanQuery(query);
  
  if(commaflag){
    idList = query.replace(/[ ]+/g,'').split(',');
    var res = [];
    for (var i = idList.length - 1; i >= 0; i--) {
      // ids are mapped from idmap and repective node is returned
      res.push(this.idMap[idList[i]].data);
    }   
    return res;
  }
  else{
    return;
  }
}



Hashtable.prototype.getNodesByTag = function(query){
  var tagList = [], commaflag = false;
  // query is processed for comma seperation ids, or spaces seperated
  commaflag = this.cleanQuery(query);

  // for comma separated tags
  if(commaflag){
    tagList = query.replace(/[ ]+/g,'').split(',');
    var res = [];
    for (var i = tagList.length - 1; i >= 0; i--) {
      // tags are looked up in tagMap and array of nodes is returned
      var mappedList = this.tagMap[tagList[i]];
      for(var j = 0; j < mappedList.length; j++ ){
        res.push(mappedList[j].data);
      }
    }    
  }
  // for space seperated tags -> parent children
  // right to left check for tags
  if(!commaflag){
    tagList = query.replace(/[ ]+/g,' ').split(' ');
    var res = [];
    var currentTag = tagList[tagList.length - 1];
    var filtredTagList = this.tagMap[currentTag] ? this.tagMap[currentTag] : [];
    for (var i = 0; i < filtredTagList.length; i++) {
      // console.log(filtredTagList[i])
      var flag = searchTag(filtredTagList[i], tagList);
      if(flag){
        res.push(filtredTagList[i].data); 
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
Hashtable.prototype.getNodesByClass = function(query){
  var classList = [], commaflag = false;
  // query is processed for comma seperation ids, or spaces seperated
  commaflag = this.cleanQuery(query);
  
  var res = [];
  if(commaflag){
    classList = query.replace(/[ ]+/g,'').split(',');
    for (var i = classList.length - 1; i >= 0; i--) {
      var mappedList = this.classMap[classList[i]];
      // iterating over the list of mapped nodes to get the data
      for(var j= 0; j < mappedList.length; j++){
        res.push(mappedList[j].data); // taking the dom 
      }
    }   
    return res;
  }
  else{
    classList = query.replace(/[ ]+/g,' ').split(' ');
    return;
  }
};

// hastable methods ends
// =================================


// ==================================
// Selector method
// ---------------

// global function for searching nodes by tags, id, classes
var $f = function(query){
  // converting the query to lowercase
  query = query.toLowerCase();
  var res = null;
  // calls the hashtable method according to the specifier
  if(query.charAt(0) === '.'){
    // if comma seperated query is there, then it removes all the . # to make a proper list of query
    res = hashtable.getNodesByClass(query.replace(/[.]+/g,''));
  }
  else if(query.charAt(0) === '#'){
    res = hashtable.getNodeById(query.replace(/[#]+/g,''));
  }
  else{
    res = hashtable.getNodesByTag(query);
  }
  return res;
};

// selector method ends
// =====================================


// =====================================
// Create Modal 
// ------------

// create modal over html to represent the html tree 
function createModal(tree){
  // Get the modal
  var modal = document.createElement('div');
  modal.id = 'tree_modal';
  modal.className = 'modal';
  document.body.appendChild(modal);
  // Now create modal-content and append to modal
  var modal_content = document.createElement('div');
  modal.appendChild(modal_content);

  modal_content.className = 'modal-content';

  // close span is created and append to modal-content to close modal
  var sp = document.createElement('span');
  sp.className = 'close' ;
  sp.innerHTML = 'X';
  sp.title = 'Close';
  modal_content.appendChild(sp);

  // modal header is created and append to modal-content
  var modal_header = document.createElement('h2');
  modal_header.innerHTML = "HTML Tree Modal"+ "<hr>";
  modal_header.className = 'text-center';
  modal_content.appendChild(modal_header);

  // modal content is divided into two columns to show tree and aside search nodes column
  var first_column = document.createElement('div');
  first_column.className = 'col-6';
  // ul is created and append to first column of modal-content to show tree
  var treehtml = document.createElement('ul');

  // tree method is called to get html format of tree
  tree.createTreeHTML(tree._root, treehtml);
  // tree is append to first_column of modal-content
  first_column.appendChild(treehtml);

  // first column is appended to modal-content
  modal_content.appendChild(first_column);

  // aside for search tags, id, classes
  var aside = document.createElement('aside');
  // aside is appended to modal_content
  modal_content.appendChild(aside);

  aside.className = 'col-6 modal-aside';
  // creating label for input
  var label = document.createElement('label');
  label.innerHTML = 'Search html nodes in the tree:';
  aside.appendChild(label);

  // creating a input for searching nodes
  var inputs = document.createElement('input');
  inputs.type = 'text';
  inputs.name = 'search';
  inputs.id = 'search_input';
  inputs.placeholder = 'Enter to search';
  // onkeyup event look up for enter key
  inputs.addEventListener("keyup", function(e){
    if(e.keyCode === 13){
      // on hit enter search query and show results
      showSearchResult(this.value);
    }
  });
  // input is append to aside of modal content
  aside.appendChild(inputs);

  // creating help text for classes, id, and tags
  var help = document.createElement('p');
  help.className = 'help-block';
  help.innerHTML = "Press Enter to search <br>Use tags to search by tags, eg: <i><u>div</u> </i> or <i><u>div, a</u></i> <br> \
  Use ' # ' to search tags by id, eg: <i><u> #header </u></i> or <i><u>#header, #footer</u></i>\
  <br> Use: ' . ' to search by class, eg: <i><u>.main-header</u></i> or <i><u>.btn, .logo</u></i> <br>"
  aside.appendChild(help);

  // creatiing a result div for input search 
  var h4 = document.createElement('h4');
  h4.innerHTML = "Search Results: ";
  aside.appendChild(h4);
  var resultDiv = document.createElement('div');
  resultDiv.id = 'resultDiv';
  resultDiv.innerHTML = 'No Results';
  resultDiv.className = 'results';
  // result div is appended to aside
  aside.appendChild(resultDiv);


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

};


// modal create ends
// ==============================


// ==============================
// Other functions used
// --------------------


var showSearchResult = function(query){
  var res = $f(query);
    var resultDiv = document.getElementById('resultDiv');
    resultDiv.innerHTML = '';
    resultDiv.className = 'results';
    // res is a object of array when query is for class or tag
    // res is a object of node when query is for id
      if(res.length){
          for (var i = 0; i < res.length; i++) {
            var rdiv = document.createElement('div');
            rdiv.innerHTML = printNodesDetails(res[i]) + '<hr>';
            resultDiv.appendChild(rdiv);
          }
      }

  if(!(resultDiv.hasChildNodes())){
    resultDiv.innerHTML = 'No Results';
  }

};

// custom function to create result div
var printNodesDetails = function(o){
  var str='';
  var outerD = document.createElement('div');
  var resHead = document.createElement('div');
  resHead.innerHTML = '<b>'+o.nodeName+'</b>';
  outerD.appendChild(resHead);

  for(var p in o){
    var innerD = document.createElement('span');
    if(p === 'id'){
     var v = o[p].length ? o[p] : null;
     innerD.innerHTML = p + ': ' + v +'; </br>';

    }
    else if(p === 'parentElement'){
      // innerD.innerHTML = p + ': { </br>' + print(o + '}';
      var par = o[p] ? o[p].nodeName : null;
      innerD.innerHTML = p + ': ' + par  + '; </br>';
    }
    if( p === 'children'){
      var c = o.children.length ? o.children.length : 0;
      innerD.innerHTML = p + ': '+ c + '; </br>';
    }
    if( p === 'classList'){
      var className = o.classList.length ? toArray(o.classList).join(', ') : null; 
      innerD.innerHTML ='class: '+ className + '; </br>';
    }
      outerD.appendChild(innerD);
  }

  return outerD.innerHTML;
};


// call this, if modal is again to be shown on html
function showModal(){
  var modal = document.getElementById('tree_modal');
  modal.style.display = 'block';
}

// to convert domList into array
var toArray = function(obj) {
  var array = [];
  // iterate backwards ensuring that length is an UInt32
  if(obj && obj.length){

    for (var i = obj.length >>> 0; i--;) { 
      array[i] = obj[i];
    }
  }
  return array;
};


// ==============================

// function call to build tree and creates a modal
// -----------------------------------------------


// final method that build tree and creates modal on html
function showHTMLTREE() {
  var top_node =  tree.createNodesTree(document);
  tree._root = top_node;
  createModal(tree);
}


// ==================================

// document.ready function
// -----------------------

// call function when dom ready
(function () {
  showHTMLTREE();
})();

// ===================================
