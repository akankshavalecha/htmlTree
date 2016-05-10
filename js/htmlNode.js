
//  Tree for for dom tree that includes Node constructor
function Tree(){
  this._root = null;
}

// a node for each dom element
function Node(data){
  this.nodeName = '';
  this.classList = [];
  this.id = '';
  this.data = data;
  this.children = [];
  this.parent = null;
}


// to add children to the node
Node.prototype.addChildren = function(n){
  this.children.push(n);
};

// to set classList, id and nodeName to node
Node.prototype.setValues = function(domNode){
  this.nodeName = domNode.nodeName.toLowerCase();
  if(domNode.className != null){
    if(domNode.className != ''){
      this.classList = (domNode.className).split(" ");
    }
  }
  this.id = domNode.id;
};

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
  if(!(node.nodeName.toLowerCase() in this.tagMap)){
    this.tagMap[node.nodeName.toLowerCase()] = [];
  }
  this.tagMap[node.nodeName.toLowerCase()].push(node);

  // set classMap
  if(node.classList.length){
    for (var i = 0; i < node.classList.length; i++) {
      if(!(node.classList[i].toLowerCase() in this.classMap)){
        this.classMap[node.classList[i].toLowerCase()] = [];
      }
      this.classMap[node.classList[i].toLowerCase()].push(node);
    }
  }

  // set idMap
  if(node.id !="" ){
    this.idMap[node.id] = node;
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
    var res = {};
    for (var i = idList.length - 1; i >= 0; i--) {
      // ids are mapped from idmap and repective node is returned
      res[idList[i]] = this.idMap[idList[i]];
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
    var res = {};
    for (var i = tagList.length - 1; i >= 0; i--) {
      // tags are looked up in tagMap and array of nodes is returned
      res[tagList[i]] = this.tagMap[tagList[i]];
    }    
  }
  // for space seperated tags -> parent children
  // right to left check for tags
  if(!commaflag){
    tagList = query.replace(/[ ]+/g,' ').split(' ');
    var res = {};
    var resList = [];
    var currentTag = tagList[tagList.length - 1];
    var filtredTagList = this.tagMap[currentTag] ? this.tagMap[currentTag] : [];
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
Hashtable.prototype.getNodesByClass = function(query){
  var classList = [], commaflag = false;
  // query is processed for comma seperation ids, or spaces seperated
  commaflag = this.cleanQuery(query);
  
  if(commaflag){
    classList = query.replace(/[ ]+/g,'').split(',');
    var res = {};
    for (var i = classList.length - 1; i >= 0; i--) {
      res[classList[i]] = this.classMap[classList[i]];
    }   
    return res;
  }
  else{
    classList = query.replace(/[ ]+/g,' ').split(' ');
    return;
  }
};

// global function for searching nodes by tags, id, classes
var $f = function(query){
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

  var modal_header = document.createElement('h2');
  modal_header.innerHTML = "HTML Tree Modal"+ "<hr>";
  modal_header.className = 'text-center';
  innerDiv.appendChild(modal_header);

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
      showSearchResult(this.value);
    }
  });
  aside.appendChild(inputs);

  // creating help text for classes, id, and tags
  var help = document.createElement('p');
  help.className = 'help-block';
  help.innerHTML = "Press Enter to search <br>Use tags to search by tags, eg: <i>div</i> <br> \
  Use ' # ' to search tags by id, eg: <i> #header </i> \
  <br> Use: ' . ' to search by class, eg: <i>.main-header</i> <br>"
  aside.appendChild(help);

  // creatiing a result div for input search 
  var h4 = document.createElement('h4');
  h4.innerHTML = "Search Results: ";
  aside.appendChild(h4);
  var resultDiv = document.createElement('div');
  resultDiv.id = 'resultDiv';
  resultDiv.innerHTML = 'No Results';
  resultDiv.className = 'results';
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
  var id = rootnode.id ? '<b>#</b>' + rootnode.id : '';
  var name_span = document.createElement('span');
  name_span.title = 'Id';
  name_span.innerHTML = id;
  li.appendChild(name_span);
  // span for class
  var className = rootnode.classList.length ? '<b>.</b>'+ rootnode.classList.join('.') : '';
  var name_span = document.createElement('span');
  name_span.title = 'Class';
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

var showSearchResult = function(query){
  var res = $f(query);
    var resultDiv = document.getElementById('resultDiv');
    resultDiv.innerHTML = '';
    resultDiv.className = 'results';

    for(item in res){
      if(res[item]){
        if(Array.isArray(res[item])){
          for (var i = 0; i < res[item].length; i++) {
            var rdiv = document.createElement('div');
            rdiv.innerHTML = print(res[item][i]) + '<hr>';
            resultDiv.appendChild(rdiv)
          }
        }
        else{
          var rdiv = document.createElement('div');
          rdiv.innerHTML = print(res[item]) + '<hr>';
          resultDiv.appendChild(rdiv)
        }
      }
    }

  if(!(resultDiv.hasChildNodes())){
    resultDiv.innerHTML = 'No Results';
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


Tree.prototype.createNodesTree = function(domNode){
  // new node is created using DOM element
  var newNode = new Node(domNode);
  // set values to node
  newNode.setValues(domNode);
  // set hashtables

  // set children and parent by recursion
  for (var i =0 ; i < domNode.children.length; i++) {
    var child = this.createNodesTree(domNode.children[i]); // child node is returned
    child.parent = newNode; // set parent to child node
    newNode.addChildren(child); // node addChildren method is called to add child
  }
  hashtable.setHashTables(newNode);
 return newNode; // finally node is returned
}

var tree = new Tree();
function showHTMLTREE() {
  var n =  tree.createNodesTree(document);
  tree._root = n;
    // tree._root = n;
  createModal(n);
}

function showModal(){
  var modal = document.getElementById('tree_modal');
  modal.style.display = 'block';
}

(function () {
  showHTMLTREE();
})();
