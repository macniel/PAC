Gallery = function(array) {
  this.callbackAddedPhoto = array["callbackAddedPhoto"];  
  this.callbackZoom = array["callbackZoom"];
  this.callbackZoomBefore = array["callbackZoomBefore"];
  this.callbackReady = array["callbackReady"];
  this.target = array["target"];
  this.template;
  this.id = array["id"];
  this.bigger = array["bigger"];
  this.userid = "";
  this.photos = {};
  this.username = array["username"];
  this.photosetName = array["photosetName"];
  this.base = "http://api.flickr.com/services/rest/?";
  this.GUID = "de.tutech.macniel.gallery";
  this.key  = "e317e26a00dd06d79b67aa24bd3b9612";
  this.photosetId = array["photosetId"];
  this.lightbox = array["lightbox"];
  this.images = [];
  this.descriptions = [];
  this.titles = [];
  this.fullImages = [];
  this.scroller;
  
  // Asyncronized Madness
  this.getUserById_Helper = function(arr) {
    if ( arr["stat"] == "ok") {
      this.userid = arr["user"]["nsid"];
    }
    this.getPhotosetId();
  }
  this.getUserById = function(id) {
    script = document.createElement("script");
    script.setAttribute("src", this.base + "method=flickr.people.findByUsername&api_key=" 
      + this.key + "&username=" + id + "&format=json&jsoncallback=" + this.id + ".getUserById_Helper");
    script.setAttribute("type", "text/javascript");
    document.getElementsByTagName("body")[0].appendChild(script);
  }

  this.getPhotosetId_Helper = function(arr) {
    if (arr["stat"] == "ok") {
      for ( var photosets in arr["photosets"]["photoset"] ) {
        var name = arr["photosets"]["photoset"][photosets]["title"]["_content"];
        if ( name === this.photosetName) {
          this.count = arr["photosets"]["photoset"][photosets]["photos"];
          this.size = this.count;
          this.photosetId = arr["photosets"]["photoset"][photosets]["id"];
        }
      }
    }
    this.getPhotos();
  }
  this.getPhotosetId = function(name, nsid) {
    if ( typeof (name) != "undefined" )
      this.photosetName = name;
    if ( typeof (nsid) != "undefined" )
      this.userid = nsid;
    var script = document.createElement("script");
    script.setAttribute("src", this.base + "method=flickr.photosets.getList&api_key=" 
      + this.key + "&user_id=" + this.userid + "&&format=json&jsoncallback=" + this.id + ".getPhotosetId_Helper");
    script.setAttribute("type", "text/javascript");
    document.getElementsByTagName("body")[0].appendChild(script);
  }   
  this.getPhotos_Helper = function(arr) {
    if ( arr["stat"] == "ok" ) {
      for ( var i in arr["photoset"]["photo"] ) {
        var id = arr["photoset"]["photo"][i]["id"];
        this.photos[id] = arr["photoset"]["photo"][i];
        
        this.getPhotoDescription(id);
      }
    }
    this.getPhotoDescription();
  }  
  this.getPhotos = function(photosetId) {
    if ( typeof photosetId != "undefined" )
      this.photosetId = photosetId;
    var script = document.createElement("script");
    script.setAttribute("src", this.base + "method=flickr.photosets.getPhotos&extras=owner_name&api_key=" 
      + this.key + "&photoset_id=" + this.photosetId + "&&format=json&jsoncallback=" + this.id + ".getPhotos_Helper");
    script.setAttribute("type", "text/javascript");
    document.getElementsByTagName("body")[0].appendChild(script);
  } 
  this.getPhotoDescription_Helper = function(arr) {
    if ( arr["stat"] == "ok" && typeof this.photos[arr["photo"]["id"]] != "undefined") {
		this.images.push("http://farm" 
			+ this.photos[arr["photo"]["id"]]["farm"]
			+ ".static.flickr.com/" 
			+ this.photos[arr["photo"]["id"]]["server"]
			+"/" 
			+ this.photos[arr["photo"]["id"]]["id"]
			+ "_" 
			+ this.photos[arr["photo"]["id"]]["secret"]
			+ "_t.jpg");
		this.fullImages.push("http://farm" 
			+ this.photos[arr["photo"]["id"]]["farm"]
			+ ".static.flickr.com/" 
			+ this.photos[arr["photo"]["id"]]["server"]
			+"/" 
			+ this.photos[arr["photo"]["id"]]["id"]
			+ "_" 
			+ this.photos[arr["photo"]["id"]]["secret"]
			+ ".jpg");
	  this.photos[arr["photo"]["id"]]["description"] = arr["photo"]["description"]["_content"];
      this.titles.push(arr["photo"]["title"]["_content"]);
      this.descriptions.push(arr["photo"]["description"]["_content"]);
      this.decreaseCount();
    }
    
  }
  
  this.decreaseCount = function() {
    this.count -= 1;
    if ( this.count == 1 ) {
	  var i = -1; 
      for ( e in this.photos ) {
		  ++i;
		  img = document.createElement("img");
		  img.setAttribute("id", i);
		  img.setAttribute("src", "http://farm" 
			+ this.photos[e]["farm"]
			+ ".static.flickr.com/" 
			+ this.photos[e]["server"]
			+"/" 
			+ this.photos[e]["id"]
			+ "_" 
			+ this.photos[e]["secret"]
			+ "_t.jpg");
		  img.setAttribute("data-biggest", "http://farm" 
			+ this.photos[e]["farm"]
			+ ".static.flickr.com/" 
			+ this.photos[e]["server"]
			+"/" 
			+ this.photos[e]["id"]
			+ "_" 
			+ this.photos[e]["secret"]
			+ "_b.jpg");
		  img.setAttribute("data-original", "http://farm" 
			+ this.photos[e]["farm"]
			+ ".static.flickr.com/" 
			+ this.photos[e]["server"]
			+"/" 
			+ this.photos[e]["id"]
			+ "_" 
			+ this.photos[e]["secret"]
			+ ".jpg");
		  img.setAttribute("alt", this.photos[e]["description"]);
		  img.setAttribute("title", this.photos[e]["title"]);
		  
		  if ( this.lightBox != true ) {
			img.setAttribute("onclick", this.id + ".zoom(this)");
		  }
		  a = document.createElement("a");
		  a.setAttribute("href", "#");
		  a.appendChild(img);
		  if ( typeof this.callbackAddedPhoto == "function" ) {
			img.style.display = "none";
		  }
		  if ( typeof this.target != "undefined" ) {
			document.getElementById(this.target).appendChild(a); 
		  } else {
			document.getElementsByTagName("body")[0].appendChild(a); 
		  }
		  if ( typeof this.callbackAddedPhoto == "function" ) {
			this.callbackAddedPhoto(a, img);
		  }
		  if ( this.photos[e]["isprimary"] == 1 ) {
			  
            this.zoom(document.getElementById(i));
       
		  }
	  }
	  if ( typeof this.callbackReady == "function" ) {
		this.callbackReady();
	  }
    }
  }
  
  this.getPhotoDescription = function(id) {
    var script = document.createElement("script");
    script.setAttribute("src", this.base + "method=flickr.photos.getInfo&api_key=" 
      + this.key + "&photo_id=" + id + "&&format=json&jsoncallback=" + this.id + ".getPhotoDescription_Helper");
    script.setAttribute("type", "text/javascript");
    document.getElementsByTagName("body")[0].appendChild(script);
  }
  
  // Default theme functionality
  
  this.scroller = function(isLeft) {
	
	if ( isLeft ) {
      document.getElementById(this.target).scrollLeft -= 1;
	} else {
	  document.getElementById(this.target).scrollLeft += 1;
	}
  }
  this.scrollLeft = function() {
	var interval;
    if ( navigator.userAgent.indexOf("Opera") != - 1 ) {
		interval = 5;
	} else {
		interval = 1;
	}
	scroller = setInterval( this.id+".scroller(true)",interval);
  }
  this.scrollRight = function() {
	var interval;
    if ( navigator.userAgent.indexOf("Opera") != - 1 ) {
		interval = 5;
	} else {
		interval = 1;
	}
	scroller = setInterval( this.id+".scroller(false)",interval);
  }
  this.cancelScroll = function() {
	clearInterval(scroller);
  }
  this.gotoTo = function(i) {
	$.prettyPhoto.open(gallery1.fullImages,gallery1.titles,gallery1.descriptions);
	for ( var j = 0; j < i ; ++j ) {
	  $.prettyPhoto.changePage("next");
	}
  }
  
  // Initialisation
  
  this.run = function(element) {
	if ( typeof element != "undefined" ) { // make it so!
	  if ( typeof element == "string" ) {
		element = document.getElementById(element);
		if ( element.nodeName != "DIV" ) 
			throw "Element " + element + " is not a DIV";
		
	  } else if ( typeof element == "object" ) {
		if ( element.nodeName != "DIV" ) 
			throw "Element " + element + " is not a DIV";
		
	  }
	  if ( typeof this.template == "undefined" ) { // warp 1
		element.innerHTML = "<div id=\"bigger\" style=\"width:500px;\"><img style=\"max-width:100%;height:334px; padding:2px; border:1px #999 solid;\"  onclick=\"" + this.id + ".gotoTo(this.getAttribute('data-id'))\"/><div/></div><div style=\"width: 500px; position: relative;\"><a id=\"nextBtn\" href=\"javascript:;\" style=\"display: block; position: absolute; left: 0; width: 5%; top: 0; bottom: 0;text-decoration:none;\" onmouseover=\"" + this.id + ".scrollLeft()\" onmouseout=\"" + this.id + ".cancelScroll()\"><img src=\"images/scroll_left.png\" alt=\"Vorherige(s) Bild(er) anzeigen\"/></a><div id=\"gallery\" style=\"display: inline-block; height: 75px; vertical-align: middle; overflow-y: hidden; left: 6%; right:6%; top:0; bottom: 0; width:87%; overflow-x: hidden; white-space:nowrap; position: relative; padding:2px; border:1px #999 solid;\">&nbsp;</div><a href=\"javascript:;\" id=\"prevBtn\"  style=\"display: block; position: absolute; right: 0; width: 5%; top: 0; bottom: 0;text-decoration:none;\" onmouseover=\"" + this.id + ".scrollRight()\" onmouseout=\"" + this.id + ".cancelScroll()\"><img src=\"images/scroll_right.png\" alt=\"N&auml;chste(s) Bild(er) anzeigen\"/></a></div>";
	  }
	}
    this.getUserById(this.username); // engage
  }
    
  this.preloader = function(target, src) {
    temp = document.createElement("img");
    temp.style.display="none";
    temp.setAttribute("data-target", target);
    temp.setAttribute("src", src);
    document.body.appendChild(temp);
    if ( typeof this.callbackZoom == "function" ) {
      if ( typeof this.callbackZoomBefore == "function" ) {
        this.callbackZoomBefore(target);
      }
    } 
      
    temp.onload = function(evt) {
      target.setAttribute("src", src);
      target.setAttribute("data-org", src);
      if ( typeof this.callbackZoom == "function")
        this.callbackZoom(target);
    };
      
  }
    
  this.slide = function(clickEvent) {
    var once = false;
    if ( typeof clickEvent == 'string' ) {
      link = parseInt(clickEvent);
      once = true;
    } else {
      clickEvent = (clickEvent ? clickEvent : window.event);
      link = clickEvent.target.getAttribute('data-link');
    }
    if ( link == -1 || link == this.photos.length ) 
      return;
    else {
	    
      img = document.getElementById(this.target).getElementsByTagName("img")[link];
      console.log(img);
      halfwidth = document.getElementById(this.target).style.width;
      halfwidth = parseInt(halfwidth.substring(0, halfwidth.length - 2)) /2;
      document.getElementById(this.target).scrollLeft = ((link-1) * 75) - 34;
      this.zoom(img, once);
    }
  }
    
  this.zoom = function(element) {
    var e = document.getElementById(this.bigger).getElementsByTagName("img")[0];
    var n = (parseInt(element.getAttribute("id")) -1),
    v = (parseInt(element.getAttribute("id")) +1);
    for ( i in document.getElementById(this.target).getElementsByTagName("img") ) {
      if ( parseInt(i) >= 0 && parseInt(i) != Math.NaN ) {
        document.getElementById(this.target).getElementsByTagName("img")[i].className = 
        document.getElementById(this.target).getElementsByTagName("img")[i].className.replace("ugallery_active", " "); 
        
      }
    }
	e.setAttribute("data-id", element.getAttribute("id"));
    element.setAttribute("class", (element.getAttribute("class") != null ? element.getAttribute("class") : "") + "ugallery_active");
    document.getElementById("nextBtn").setAttribute("data-link", n );
    document.getElementById("prevBtn").setAttribute("data-link", v );
    document.getElementById("nextBtn").setAttribute("onclick", this.id + ".slide('" + n + "')");
    document.getElementById("prevBtn").setAttribute("onclick", this.id + ".slide('" + v + "')");
    this.preloader(e, element.getAttribute("data-original"));
    var e1 = document.getElementById(this.bigger).getElementsByTagName("div")[0];
    e.setAttribute("data-biggest", element.getAttribute("data-biggest"));
    e1.innerHTML = element.getAttribute("title");
    if ( typeof this.callbackZoom == "function" ) {
      this.callbackZoom(e);
    }  
       
  }
    
  return this;
}
  