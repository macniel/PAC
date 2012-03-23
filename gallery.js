/*global $:true */
$.fn.prettyPhoto();
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
			getPhotos = function (callback) {
				$.getJSON(aBaseUrl + "method=flickr.photosets.getPhotos&api_key=" + key + "&photoset_id=" + photosetId +
					"&format=json&jsoncallback=?",
					function (data) {
						var i = 0,
							aData,
							bData,
							imageBasePath,
							p,
							descriptionCallback = function (bData) {
								var desc = bData.photo.description._content,
									pp = clas.getPhoto(bData.photo.id);
								pp.setDescription(desc);
								$(pp.getHTML()).attr("alt", desc);
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
								$.getJSON(aBaseUrl + "method=flickr.photos.getInfo&api_key=" + key + "&photo_id=" + aData.id + "&format=json&jsoncallback=?", descriptionCallback);
							}
						}
					}
					);
			},
			translatePhotosetName = function (callback) {
				$.getJSON(aBaseUrl + "method=flickr.photosets.getList&api_key=" + key + "&user_id=" + userId +
					"&format=json&jsoncallback=?",
					function (data) {
						var i = 0;
						for (i in data.photosets.photoset) {
							if (data.photosets.photoset.hasOwnProperty(i) && data.photosets.photoset[i].title._content === galleryName) {
								photosetId = data.photosets.photoset[i].id;
								getPhotos();
								return;
							}
						}
						throw new PAC.Exception("GalleryNotFoundException", "Photoset \"" + galleryName + "\" was not found.");
					}
					);
			},
			translateUserName = function () {
				$.getJSON(aBaseUrl + "method=flickr.people.findByUsername&api_key=" + key + "&username=" + aUserName + "&format=json&jsoncallback=?",
					function (data) {
						userId = data.user.nsid;
						if (data.stat === "1") {
							throw new PAC.Exception("UserNotFoundException", "User \"" + aUserName + "\" not found");
						}
						translatePhotosetName();
					}
					);
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
};