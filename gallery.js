 /*global $:true */
$.fn.prettyPhoto();
tempData = "";
jsonFlickrApi = function(data) {
    tempData = data;
}
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */
 
/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num)
{
  str = "";
  for(j = 0; j <= 3; j++)
    str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
           hex_chr.charAt((num >> (j * 8)) & 0x0F);
  return str;
}
 
/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str)
{
  nblk = ((str.length + 8) >> 6) + 1;
  blks = new Array(nblk * 16);
  for(i = 0; i < nblk * 16; i++) blks[i] = 0;
  for(i = 0; i < str.length; i++)
    blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
  blks[i >> 2] |= 0x80 << ((i % 4) * 8);
  blks[nblk * 16 - 2] = str.length * 8;
  return blks;
}
 
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
 * to work around bugs in some JS interpreters.
 */
function add(x, y)
{
  var lsw = (x & 0xFFFF) + (y & 0xFFFF);
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return (msw << 16) | (lsw & 0xFFFF);
}
 
/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt)
{
  return (num << cnt) | (num >>> (32 - cnt));
}
 
/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t)
{
  return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t)
{
  return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t)
{
  return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t)
{
  return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t)
{
  return cmn(c ^ (b | (~d)), a, b, x, s, t);
}
 
/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str)
{
  x = str2blks_MD5(str);
  a =  1732584193;
  b = -271733879;
  c = -1732584194;
  d =  271733878;
 
  for(i = 0; i < x.length; i += 16)
  {
    olda = a;
    oldb = b;
    oldc = c;
    oldd = d;
 
    a = ff(a, b, c, d, x[i+ 0], 7 , -680876936);
    d = ff(d, a, b, c, x[i+ 1], 12, -389564586);
    c = ff(c, d, a, b, x[i+ 2], 17,  606105819);
    b = ff(b, c, d, a, x[i+ 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i+ 4], 7 , -176418897);
    d = ff(d, a, b, c, x[i+ 5], 12,  1200080426);
    c = ff(c, d, a, b, x[i+ 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i+ 7], 22, -45705983);
    a = ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);
    d = ff(d, a, b, c, x[i+ 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i+10], 17, -42063);
    b = ff(b, c, d, a, x[i+11], 22, -1990404162);
    a = ff(a, b, c, d, x[i+12], 7 ,  1804603682);
    d = ff(d, a, b, c, x[i+13], 12, -40341101);
    c = ff(c, d, a, b, x[i+14], 17, -1502002290);
    b = ff(b, c, d, a, x[i+15], 22,  1236535329);    
 
    a = gg(a, b, c, d, x[i+ 1], 5 , -165796510);
    d = gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
    c = gg(c, d, a, b, x[i+11], 14,  643717713);
    b = gg(b, c, d, a, x[i+ 0], 20, -373897302);
    a = gg(a, b, c, d, x[i+ 5], 5 , -701558691);
    d = gg(d, a, b, c, x[i+10], 9 ,  38016083);
    c = gg(c, d, a, b, x[i+15], 14, -660478335);
    b = gg(b, c, d, a, x[i+ 4], 20, -405537848);
    a = gg(a, b, c, d, x[i+ 9], 5 ,  568446438);
    d = gg(d, a, b, c, x[i+14], 9 , -1019803690);
    c = gg(c, d, a, b, x[i+ 3], 14, -187363961);
    b = gg(b, c, d, a, x[i+ 8], 20,  1163531501);
    a = gg(a, b, c, d, x[i+13], 5 , -1444681467);
    d = gg(d, a, b, c, x[i+ 2], 9 , -51403784);
    c = gg(c, d, a, b, x[i+ 7], 14,  1735328473);
    b = gg(b, c, d, a, x[i+12], 20, -1926607734);
     
    a = hh(a, b, c, d, x[i+ 5], 4 , -378558);
    d = hh(d, a, b, c, x[i+ 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i+11], 16,  1839030562);
    b = hh(b, c, d, a, x[i+14], 23, -35309556);
    a = hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
    d = hh(d, a, b, c, x[i+ 4], 11,  1272893353);
    c = hh(c, d, a, b, x[i+ 7], 16, -155497632);
    b = hh(b, c, d, a, x[i+10], 23, -1094730640);
    a = hh(a, b, c, d, x[i+13], 4 ,  681279174);
    d = hh(d, a, b, c, x[i+ 0], 11, -358537222);
    c = hh(c, d, a, b, x[i+ 3], 16, -722521979);
    b = hh(b, c, d, a, x[i+ 6], 23,  76029189);
    a = hh(a, b, c, d, x[i+ 9], 4 , -640364487);
    d = hh(d, a, b, c, x[i+12], 11, -421815835);
    c = hh(c, d, a, b, x[i+15], 16,  530742520);
    b = hh(b, c, d, a, x[i+ 2], 23, -995338651);
 
    a = ii(a, b, c, d, x[i+ 0], 6 , -198630844);
    d = ii(d, a, b, c, x[i+ 7], 10,  1126891415);
    c = ii(c, d, a, b, x[i+14], 15, -1416354905);
    b = ii(b, c, d, a, x[i+ 5], 21, -57434055);
    a = ii(a, b, c, d, x[i+12], 6 ,  1700485571);
    d = ii(d, a, b, c, x[i+ 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i+10], 15, -1051523);
    b = ii(b, c, d, a, x[i+ 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);
    d = ii(d, a, b, c, x[i+15], 10, -30611744);
    c = ii(c, d, a, b, x[i+ 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i+13], 21,  1309151649);
    a = ii(a, b, c, d, x[i+ 4], 6 , -145523070);
    d = ii(d, a, b, c, x[i+11], 10, -1120210379);
    c = ii(c, d, a, b, x[i+ 2], 15,  718787259);
    b = ii(b, c, d, a, x[i+ 9], 21, -343485551);
 
    a = add(a, olda);
    b = add(b, oldb);
    c = add(c, oldc);
    d = add(d, oldd);
  }
  return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}

/**
 * The Class Photo is a model to store a single image from an Image provider.
 * It should hold a thumbnail of the picture, the original picture, a title 
 * and a description, it also contain a reference to its destinated DOMElement
 */
var PAC = {
	Photo : function (aId, aTitle, aIsPrimary, aDescription, aSrc, aThumbnail) {
		"use strict";
		var link,
			id = aId,
			source = aSrc,
			thumbnail = aThumbnail,
			primary =  aIsPrimary === 1 || aIsPrimary === "1" || aIsPrimary === true,
			title = aTitle,
			description = aDescription,
			element;
		this.setLink = function (url) {
			link = url;
		};
		this.getLink = function () {
			return link;
		};
		this.getId = function () {
			return id;
		};
		this.getSource = function () {
			return source;
		};
		this.getThumbnail = function () {
			return thumbnail;
		};
		this.isPrimary = function () {
			return primary;
		};
		this.getTitle = function () {
			return title;
		};
		this.getDescription = function () {
			return description;
		};
		this.setDescription = function (str) {
			description = str;
		};
		this.getHTML = function () {
			return element;
		};
		this.bindHTML = function (domElement) {
			element = domElement;
		};
		return this;
	},

	/**
	 * Exception is a Class to handle custom Exceptions and or Errors
	 */
	Exception : function (aType, aMessage) {
		"use strict";
		var message = aMessage,
			type = aType;
		this.getMessage = function () {
			return message;
		};
		this.getType = function () {
			return type;
		};
		PAC.Exception.prototype.toString = function () {
			return this.getType() + ": " + this.getMessage();
		};
	},

	/**
	 * The BaseClass GalleryAdapter is an abstract class, which is used to
	 * display images and manage those from an image provider.
	 * It can be extended by overriding the privileged function fetchAll
	 */
	GalleryAdapter : function () {
		"use strict";
		// private
		var photos = [],
			images = [],
			descriptions = [],
			titles = [],
			self = this;
		// privileged
		this.getPhoto = function (byId) {
			var e = 0;
			for (e in photos) {
				if (photos.hasOwnProperty(e) && photos[e].getId() === byId) {
					return photos[e];
				}
			}
		};
		/**
		 * @returns an Array of Photo Objects
		 */
		this.getPhotos = function () {
			return photos;
		};
		/**
		 * This function adds another photo object
		 * @param photoSrc the photo object
		 */
		this.addPhoto = function (photoSrc) {
			photos.push(photoSrc);
		};
		this.addDescription = function (str) {
			descriptions.push(str);
		};
		this.addImage = function (src) {
			images.push(src);
		};
		this.addTitle = function (str) {
			titles.push(str);
		};
		this.publishPhotos = function () {
			var i = 0;
			for (i in photos) {
				if (photos.hasOwnProperty(i)) {
					this.publishPhoto(photos[i]);
				}
			}
		};
		this.publishPhoto = function (photo, targetId) {
			var img = $(document.createElement("img"));
			if (typeof photo.getThumbnail !== "undefined") {
				img.attr("src", photo.getThumbnail());
			} else {
				img.attr("src", photo.getSource());
				img.css({width: "75px", height: "75px"});
			}
			img.attr("title", photo.getTitle());
			img.attr("alt", photo.getDescription().toString().substring(0, 80));
			img.data("bigger", photo.getSource());
			this.addTitle(photo.getTitle());
			this.addImage(photo.getSource());
			this.addDescription(photo.getDescription());
			img.bind("click", function () {
				$("#" + targetId + "_bigger img").hide().attr("src", $(this).data("bigger")).load(function () { $(this).fadeIn(); });
				$("#" + targetId + "_bigger img").attr("title", $(this).attr("title"));
				$("#" + targetId + "_bigger div#description").html($(this).attr("alt"));
				var i = 0;
				for (i = 0; i < $("#" + targetId + "_gallery img").length; i = i + 1) {
					if ($("#" + targetId + "_gallery img")[i] === this) {
						break;
					}
				}
				$("#" + targetId + "_bigger img").data("id", i);
				$("#" + targetId + "_bigger img").bind("click", function (evt) {
					var j = 0,
						id;
					if ($("div.ppt:visible").length === 0) {
						$.prettyPhoto.open(images, titles, descriptions);
						id = $(this).data("id");
						for (; j < id; j = j + 1) {
							$.prettyPhoto.changePage("next");
						}
					}
				});
				$('#' + targetId + '_description').hide();
				if (typeof photo.getLink() !== "undefined") {
					$("#" + targetId + "_bigger div#title a").attr("href", photo.getLink());
					$("#" + targetId + "_bigger div#title a").attr("title", "Bild auf " + self.getProvider() + " ansehen");
				} else {
					$("#" + targetId + "_bigger div#title a").attr("href", "#");
				}
				$("#" + targetId + "_bigger div#title a").text($(this).attr("title"));
				$("#" + targetId + "_gallery img").removeClass("active");
				$(img).addClass("active");
				return false;
			});
			img.addClass("thumbnail");
			if (photo.isPrimary()) {
				img.addClass("active");
				img.click();
			}
			photo.bindHTML(img);
			$("#" + targetId + "_gallery").append(img);
			img.hide().fadeIn();
		};
		this.getProvider = function () {};
		this.fetchAll = function () {};
		// finalize
		return this;
	},
	/**
	 * @class FlickrAdapter this Class is an Adapter to the Image Provider Flickr.com,
	 * it needs an apiKey to enable communication to the Server
	 * the configuration is supposed to be an array, where parameters are set.
	 * @returns FlickrAdapter
	 */
	FlickrAdapter : function (apiKey, targetId, configuration) {
		"use strict";
		// inheritage
		var clas = new PAC.GalleryAdapter(),
		// private fields and functions
			galleryName = configuration.galleryName,
			aUserName = configuration.userName,
			aTarget = targetId,
			aBaseUrl = "http://api.flickr.com/services/rest/?",
			userId,
			photosetId,
			key = apiKey,
                        aSecret = "SECRETKEY", // Put Secret Key HERE
			isSigned = (configuration.signed? configuration.signed : false ),
			aAuthToken = "72157631108391174-7a12fcf3a5289d12",
			getAuthSig = function(secret, params) {
				var keyValues = params,
				    inputString = secret;
				for ( var i in keyValues ) {
					inputString += i + keyValues[i];
				}
				return calcMD5(inputString);
			},
			getCallUrl = function(params) {
				var url = aBaseUrl;
				for ( var i in params ) {
					url += i + "=" + params[i] + "&";
				}
				return url + "api_sig=" + getAuthSig(aSecret,params);
			},
			getPhotos = function (callback) {
				var parameter = {
					api_key: key,
					auth_token: aAuthToken,
					format: "json",
					jsoncallback: "jsonFlickrApi",
					method : "flickr.photosets.getPhotos",
					photoset_id: photosetId,
				};
				 jQuery.ajax({
                    dataType: 'jsonp',
                    url: getCallUrl(parameter),
                    cache: true,
                    async: true,
                    jsonp:'jsoncallback',
                    jsonpCallback: 'jsonFlickrApi',
                    success: function() {
						var i = 0,
							data = tempData,
							aData,
							bData,
							imageBasePath,
							p,
							descriptionCallback = function (bData) {
								
							};
						for (i in data.photoset.photo) {
							if (data.photoset.photo.hasOwnProperty(i)) {
								
								aData = data.photoset.photo[i];
								imageBasePath = "http://farm" + aData.farm + ".static.flickr.com/" + aData.server + "/"
									+ aData.id + "_" + aData.secret;
								p = new PAC.Photo(aData.id, aData.title, aData.isprimary === "1", "", imageBasePath + "_z.jpg", imageBasePath + "_s.jpg");
								p.setLink("http://www.flickr.com/photos/" + aUserName + "/" + aData.id + "/in/set-" + photosetId + "/");
								clas.addPhoto(p);
								clas.publishPhoto(p, targetId);
								var parameter = {
									api_key: key,
									photo_id: aData.id,
									format: "json",
									}
								};
								jQuery.ajax({
									dataType: "jsonp",
									url: getCallUrl(parameter),
									cache: true,
									async: true,
									jsonp: "jsoncallback",
									jsonpCallback: "jsonFlickrApi",
									success: function() {
										var desc = tempData.photo.description._content,
										pp = clas.getPhoto(tempData.photo.id);
										pp.setDescription(desc);
										$(pp.getHTML()).attr("alt", desc);
									},
								});
							}
						}
				});
			},
			translatePhotosetName = function (callback) {
				var parameter = {
					api_key: key,
					auth_token: aAuthToken,
					format: "json",
                    jsoncallback: "jsonFlickrApi",
					method : "flickr.photosets.getList",
					user_id: userId
				};
                jQuery.ajax({
                    dataType: 'jsonp',
                    url: getCallUrl(parameter),
                    cache: true,
                    async: true,
                    jsonp:'jsoncallback',
                    jsonpCallback: 'jsonFlickrApi',
                    success: function() {
						var i = 0;
						for (i in tempData.photosets.photoset) {
							        if (tempData.photosets.photoset.hasOwnProperty(i) && tempData.photosets.photoset[i].title._content === galleryName) {
								photosetId = tempData.photosets.photoset[i].id;
								getPhotos();
								return;
							}
						}
						throw new PAC.Exception("GalleryNotFoundException", "Photoset \"" + galleryName + "\" was not found.");
					}
				});
			},
			translateUserName = function () {
				var parameter = {
					api_key: key,
					auth_token: aAuthToken,
					format: "json",
                                        jsoncallback: "jsonFlickrApi",
                                        method : "flickr.people.findByUsername",
					username: aUserName,
				};
				jQuery.ajax({
					dataType: 'jsonp',
					url: getCallUrl(parameter),
					cache: true,
					async: true,
					jsonp:'jsoncallback',
					jsonpCallback: 'jsonFlickrApi',
					success: function() { 
						userId = tempData.user.nsid;
						if (tempData.stat === "1") {
							throw new PAC.Exception("UserNotFoundException", "User \"" + aUserName + "\" not found");
					} 
						translatePhotosetName();
					}
				});
			};
		if (typeof configuration !== "object") {
			throw new PAC.Exception("UnexpectedTypeError", "argument #2 has to be of type \"Array\"");
		}
		if (typeof configuration.galleryName === "undefined") {
			throw new PAC.Exception("UndefinedValueException", "variable \"galleryName\" is undefined");
		}
		if (typeof configuration.userName === "undefined") {
			throw new PAC.Exception("UndefinedValueException", "variable \"userName\" is undefined");
		}
		clas.fetchAll = function () {
			translateUserName();
		};
		clas.getProvider = function () {
			return "FlickR";
		};
		// finalize
		return clas;
	},
	Gallery : function (AdapterType, apiKey, configuration, targetId) {
		"use strict";
		// check dependencies
		if (typeof window.jQuery === "undefined") {
			throw new PAC.Exception("NoSuchMethodException", "jQuery Library is not loaded");
		}
                // define type of adapter
		var clas;
		if (typeof AdapterType === "string" && typeof window[AdapterType] !== "undefined") {
			clas = new window[AdapterType](apiKey, targetId, configuration);
		} else if (typeof AdapterType === "object") {
			clas = AdapterType;
		} else if (typeof AdapterType === "function") {
			clas = new AdapterType(apiKey, targetId, configuration);
		} else {
			throw new PAC.Exception("NoSuchClassError", "Class \"" + AdapterType + "\" not found");
		}
		// add additional functions
		// finalize
		return clas;
	},
	_scroller : function (isLeft, targetId) {
		"use strict";
		if (isLeft) {
			$("#" + targetId + "_gallery").scrollLeft($("#" + targetId + "_gallery").scrollLeft() - 1);
		} else {
			$("#" + targetId + "_gallery").scrollLeft($("#" + targetId + "_gallery").scrollLeft() + 1);
		}
	},
	_scrollLeft : function (rtl, targetId) {
		"use strict";
		var interval;
		if ( typeof targetId === "undefined" ) {
                        targetId = rtl;
                        rtl = true;
                }
		if (navigator.userAgent.indexOf("Opera") !== -1) {
			interval = 5;
		} else {
			interval = 1;
		}
		if (rtl === false) {
			window.scroller = setInterval(function () { PAC._scroller(false, targetId); }, interval);
		} else {
			window.scroller = setInterval(function () { PAC._scroller(true, targetId); }, interval);
		}
	},
	_scrollRight : function (targetId) {
		"use strict";
		PAC._scrollLeft(false, targetId);
	},
	cancelScroll : function (targetId) {
		"use strict";
		clearInterval(window.scroller, targetId);
	}
};

HTMLDivElement.prototype.gallerify = function (AdapterType, apiKey, configuration) {
	"use strict";
	
	var id = $(this).attr("id"),
	    clas = new PAC.Gallery(AdapterType, apiKey, configuration, id);
        $(this).html(
		"<div style=\"position: relative; width: 500px; height: 420px\"><div id=\"" + id + "_bigger\" style=\"position: absolute; bottom: 92px; top: 0; text-align: center; width: 500px; height: 328px\"><div id=\"" + id + "_title\" style=\"width: 500px;white-space:nowrap; text-align: left\"><a href=\"\">&nbsp;</a></div><img style=\"max-width: 500px; max-height: 328px; margin: auto 0\" /><div id=\"up-triangle\"></div></div><div class=\"gallerybox\" style=\"position: absolute; width: 500px; height: 80px; bottom: 0;\"><div id=\"" + id + "_left\" onmouseover=\"PAC._scrollLeft('" + id + "')\" onmouseout=\"PAC.cancelScroll('" + id + "')\"><img src=\"images/Actions-go-previous-icon.png\" alt=\"Vorheriges Bild anzeigen\" style=\"margin-top:23px; border:none;\"/></div><div id=\"" + id + "_right\" onmouseover=\"PAC._scrollRight('" + id + "')\" onmouseout=\"PAC.cancelScroll('" + id + "')\"><img src=\"images/Actions-go-next-icon.png\" alt=\"N&auml;chstes Bild anzeigen\" style=\"margin-top:23px; margin-left:-6px; border:none;\"/></div><div id=\"" + id + "_gallery\">&nbsp;</div></div></div>"
	);
	clas.fetchAll();
        window["clas"] = clas;
};