Gallery = function(array) {
    this.callbackAddedPhoto = array["callbackAddedPhoto"];  
    this.callbackZoom = array["callbackZoom"];
    this.callbackZoomBefore = array["callbackZoomBefore"];
    this.callbackReady = array["callbackReady"];
    this.target = array["target"];
    this.id = array["id"];
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
        img = document.createElement("img");

        img.setAttribute("id", this.size - this.count);
        img.setAttribute("src", "http://farm" 
                                + this.photos[arr["photo"]["id"]]["farm"]
                                + ".static.flickr.com/" 
                                + this.photos[arr["photo"]["id"]]["server"]
                                +"/" 
                                + this.photos[arr["photo"]["id"]]["id"]
                                + "_" 
                                +this.photos[arr["photo"]["id"]]["secret"]
                                + "_t.jpg");
        img.setAttribute("data-biggest", "http://farm" 
                                + this.photos[arr["photo"]["id"]]["farm"]
                                + ".static.flickr.com/" 
                                + this.photos[arr["photo"]["id"]]["server"]
                                +"/" 
                                + this.photos[arr["photo"]["id"]]["id"]
                                + "_" 
                                +this.photos[arr["photo"]["id"]]["secret"]
                                + "_b.jpg");
        img.setAttribute("data-original", "http://farm" 
                                + this.photos[arr["photo"]["id"]]["farm"]
                                + ".static.flickr.com/" 
                                + this.photos[arr["photo"]["id"]]["server"]
                                +"/" 
                                + this.photos[arr["photo"]["id"]]["id"]
                                + "_" 
                                +this.photos[arr["photo"]["id"]]["secret"]
                                + ".jpg");
        img.setAttribute("alt", arr["photo"]["description"]["_content"]);
        img.setAttribute("title", arr["photo"]["description"]["_content"]);
        this.images.push(img.getAttribute("src"));
        this.titles.push("");
        this.descriptions.push(arr["photo"]["description"]["_content"]);
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
        this.decreaseCount();
      }
      
    }
  
    this.decreaseCount = function() {
      this.count -= 1;
	  var i = 0;
      if ( this.count <= 0 ) {
         for ( e in this.photos ) {
		    if ( this.photos[e]["isprimary"] == "1" ) {
              if ( typeof this.lightbox == "undefined" || this.lightbox == "false" || this.lightbox == false ) {
			    
                this.zoom(document.getElementById(i));
              }
            }
			i++;
            
         }
      }
      if ( this.count <= 0 && typeof this.callbackReady == "function") {
            this.callbackReady();
      }
    }
  
    this.getPhotoDescription = function(id) {
      var script = document.createElement("script");
      script.setAttribute("src", this.base + "method=flickr.photos.getInfo&api_key=" 
                                 + this.key + "&photo_id=" + id + "&&format=json&jsoncallback=" + this.id + ".getPhotoDescription_Helper");
      script.setAttribute("type", "text/javascript");
      document.getElementsByTagName("body")[0].appendChild(script);
    }
  
    this.run = function() {
      this.getUserById(this.username);
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
       var e = document.getElementById("bigger").getElementsByTagName("img")[0];
       var n = (parseInt(element.getAttribute("id")) -1),
           v = (parseInt(element.getAttribute("id")) +1);
       document.getElementById("nextBtn").setAttribute("data-link", n );
       document.getElementById("prevBtn").setAttribute("data-link", v );
       document.getElementById("nextBtn").setAttribute("onclick", this.id + ".slide('" + n + "')");
       document.getElementById("prevBtn").setAttribute("onclick", this.id + ".slide('" + v + "')");
	   this.preloader(e, element.getAttribute("data-original"));
       var e1 = document.getElementById("bigger").getElementsByTagName("div")[0];
       e.setAttribute("data-biggest", element.getAttribute("data-biggest"));
	   e1.innerHTML = element.getAttribute("title");
       if ( typeof this.callbackZoom == "function" ) {
         this.callbackZoom(e);
      }  
       
    }
    
    return this;
}
  