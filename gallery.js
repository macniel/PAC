/*global $:true */
$.fn.prettyPhoto();
/**
 * The Class Photo is a model to store a single image from an Image provider.
 * It should hold a thumbnail of the picture, the original picture, a title 
 * and a description, it also contain a reference to its destinated DOMElement
 */
var Photo = function (aId, aTitle, aIsPrimary, aDescription, aSrc, aThumbnail) {
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
	Exception = function (aType, aMessage) {
		"use strict";
		var message = aMessage,
			type = aType;
		this.getMessage = function () {
			return message;
		};
		this.getType = function () {
			return type;
		};
		Exception.prototype.toString = function () {
			return this.getType() + ": " + this.getMessage();
		};
	},

	/**
	 * The BaseClass GalleryAdapter is an abstract class, which is used to
	 * display images and manage those from an image provider.
	 * It can be extended by overriding the privileged function fetchAll
	 */
	GalleryAdapter = function () {
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
		this.publishPhoto = function (photo) {
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
				$("#bigger img").hide().attr("src", $(this).data("bigger")).load(function () { $(this).fadeIn(); });
				$("#bigger img").attr("title", $(this).attr("title"));
				$("#bigger div#description").html($(this).attr("alt"));
				$("#bigger a#link").attr("href", "#");
				var i = 0;
				for (i = 0; i < $("#gallery img").length; i = i + 1) {
					if ($("#gallery img")[i] === this) {
						break;
					}
				}
				$("#bigger a#link").data("id", i);
				$("#bigger a#link").bind("click", function (evt) {
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
				$('#description').hide();
				if (typeof photo.getLink() !== "undefined") {
					$("#bigger div#title a").attr("href", photo.getLink());
					$("#bigger div#title a").attr("title", "Bild auf " + self.getProvider() + " ansehen");
				} else {
					$("#bigger div#title a").attr("href", "#");
				}
				$("#bigger div#title a").text($(this).attr("title"));
				$("#gallery img").removeClass("active");
				$(img).addClass("active");
				return false;
			});
			img.addClass("thumbnail");
			if (photo.isPrimary()) {
				img.addClass("active");
				img.click();
			}
			photo.bindHTML(img);
			$("#gallery").append(img);
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
	FlickrAdapter = function (apiKey, configuration) {
		"use strict";
		// inheritage
		var clas = new GalleryAdapter(),
		// private fields and functions
		    galleryName = configuration.galleryName,
			aUserName = configuration.userName,
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
							p;
						for (i in data.photoset.photo) {
							if (data.photoset.photo.hasOwnProperty(i)) {
								aData = data.photoset.photo[i];
								imageBasePath = "http://farm" + aData.farm + ".static.flickr.com/" + aData.server + "/"
									+ aData.id + "_" + aData.secret;
								p = new Photo(aData.id, aData.title, aData.isprimary === "1", "", imageBasePath + "_z.jpg", imageBasePath + "_t.jpg");
								p.setLink("http://www.flickr.com/photos/" + aUserName + "/" + aData.id + "/in/set-" + photosetId + "/");
								clas.addPhoto(p);
								clas.publishPhoto(p);
								$.getJSON(aBaseUrl + "method=flickr.photos.getInfo&api_key=" + key + "&photo_id=" + aData.id
									+ "&format=json&jsoncallback=?",
										function (bData) {
										var desc = bData.photo.description._content,
											pp = clas.getPhoto(bData.photo.id);
										pp.setDescription(desc);
										$(pp.getHTML()).attr("alt", desc);
									}
									);
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
						throw new Exception("GalleryNotFoundException", "Photoset \"" + galleryName + "\" was not found.");
					}
					);
			},
			translateUserName = function () {
				$.getJSON(aBaseUrl + "method=flickr.people.findByUsername&api_key=" + key + "&username=" + aUserName + "&format=json&jsoncallback=?",
					function (data) {
						userId = data.user.nsid;
						if (data.stat === "1") {
							throw new Exception("UserNotFoundException", "User \"" + aUserName + "\" not found");
						}
						translatePhotosetName();
					}
					);
			};
		if (typeof configuration !== "object") {
			throw new Exception("UnexpectedTypeError", "argument #2 has to be of type \"Array\"");
		}
		if (typeof configuration.galleryName === "undefined") {
			throw new Exception("UndefinedValueException", "variable \"galleryName\" is undefined");
		}
		if (typeof configuration.userName === "undefined") {
			throw new Exception("UndefinedValueException", "variable \"userName\" is undefined");
		}
		clas.fetchAll = function () {
			translateUserName();
		};
		clas.getProvider = function () {
			return "FlickR";
		}
		// finalize
		return clas;
	};
	
	HTMLDivElement.prototype.gallerify = function (adapterType, apiKey, configuration) {
		"use strict";
		// check dependencies
		if (typeof window.jQuery === "undefined") {
			throw new Exception("NoSuchMethodException", "jQuery Library is not loaded");
		}
		// define type of adapter
		var clas;
		if (typeof adapterType === "string" && typeof window[adapterType] !== "undefined") {
			clas = new window[adapterType](apiKey, configuration);
		} else if (typeof adapterType === "object") {
			clas = adapterType;
		} else if (typeof adapterType === "function") {
			clas = new adapterType(apiKey, configuration);
		} else {
			throw new Exception("NoSuchClassError", "Class \"" + adapterType + "\" not found");
		}
		
		$(this).html(
			"<div style=\"position: relative; width: 500px; height: 420px\">\
		<div id=\"bigger\" style=\"position: absolute; bottom: 92px; top: 0;\">\
		<div id=\"title\" style=\"width: 100%\">\
				<a href=\"\">&nbsp;</a>\
			</div>\
				<a id=\"link\" href=\"\" onmouseover=\"$('#description').fadeIn()\">\
			<img style=\"width: 500px; max-height: 420px; position: absolute; bottom: 0\" />\
		<div id=\"up-triangle\"></div>\
		</div>\
		<div class=\"gallerybox\" style=\"position: absolute; width: 500px; height: 80px; bottom: 0;\">\
			<div id=\"left\" onmouseover=\"_scrollLeft()\" onmouseout=\"cancelScroll()\"><img src=\"images/Actions-go-previous-icon.png\" alt=\"Vorheriges Bild anzeigen\" style=\"margin-top:23px; border:none;\"/></div>\
			<div id=\"right\" onmouseover=\"_scrollRight()\" onmouseout=\"cancelScroll()\">\
			<img src=\"images/Actions-go-next-icon.png\" alt=\"N&auml;chstes Bild anzeigen\" style=\"margin-top:23px; margin-left:-6px; border:none;\"/></div>\
			<div id=\"gallery\">&nbsp;</div>\
		</div>\
	</div>"
		);
		
		window._scroller = function (isLeft) {
			"use strict";
			if (isLeft) {
				$("#gallery").scrollLeft($("#gallery").scrollLeft() - 1);
			} else {
				$("#gallery").scrollLeft($("#gallery").scrollLeft() + 1);
			}
		};
		window._scrollLeft = function (rtl) {
			"use strict";
			var interval;
			if (navigator.userAgent.indexOf("Opera") !== -1) {
				interval = 5;
			} else {
				interval = 1;
			}
			if (rtl === false) {
				window.scroller = setInterval("_scroller(false)", interval);
			} else {
				window.scroller = setInterval("_scroller(true)", interval);
			}
		};
		window._scrollRight = function () {
			"use strict";
			_scrollLeft(false);
		};
		window.cancelScroll = function () {
			"use strict";
			clearInterval(window.scroller);
		};
		clas.fetchAll();
	}
	
	Gallery = function (adapterType, apiKey, configuration) {
		"use strict";
		// check dependencies
		if (typeof window.jQuery === "undefined") {
			throw new Exception("NoSuchMethodException", "jQuery Library is not loaded");
		}
		// define type of adapter
		var clas;
		if (typeof adapterType === "string" && typeof window[adapterType] !== "undefined") {
			clas = new window[adapterType](apiKey, configuration);
		} else if (typeof adapterType === "object") {
			clas = adapterType;
		} else if (typeof adapterType === "function") {
			clas = new adapterType(apiKey, configuration);
		} else {
			throw new Exception("NoSuchClassError", "Class \"" + adapterType + "\" not found");
		}
		// add additional functions
		// finalize
		return clas;
	},
	_scroller = function (isLeft) {
		"use strict";
		if (isLeft) {
			$("#gallery").scrollLeft($("#gallery").scrollLeft() - 1);
		} else {
			$("#gallery").scrollLeft($("#gallery").scrollLeft() + 1);
		}
	},
	_scrollLeft = function (rtl) {
		"use strict";
		var interval;
		if (navigator.userAgent.indexOf("Opera") !== -1) {
			interval = 5;
		} else {
			interval = 1;
		}
		if (rtl === false) {
			window.scroller = setInterval("_scroller(false)", interval);
		} else {
			window.scroller = setInterval("_scroller(true)", interval);
		}
	},
	_scrollRight = function () {
		"use strict";
		_scrollLeft(false);
	},
	cancelScroll = function () {
		"use strict";
		clearInterval(window.scroller);
	};