import DEFAULTS from './defaults';
import TEMPLATE from './template';
import render from './render';
import preview from './preview';
import events from './events';
import handlers from './handlers';
import change from './change';
import methods from './methods';
import * as $ from './utilities';

// Constants
const NAMESPACE = 'cropper';

// Classes
const CLASS_HIDDEN = `${NAMESPACE}-hidden`;

// Events
const EVENT_ERROR = 'error';
const EVENT_LOAD = 'load';
const EVENT_READY = 'ready';
const EVENT_CROP = 'crop';

// RegExps
const REGEXP_DATA_URL = /^data:/;
const REGEXP_DATA_URL_JPEG = /^data:image\/jpeg;base64,/;

let AnotherCropper;

class Cropper {
  constructor(element, options) {
    const self = this;
    self.element = element;
    self.options = $.extend({}, DEFAULTS, $.isPlainObject(options) && options);
    self.loaded = false;
    self.ready = false;
    self.complete = false;
    self.rotated = false;
    self.cropped = false;
    self.disabled = false;
    self.replaced = false;
    self.limited = false;
    self.wheeling = false;
    self.isImg = false;
    self.originalUrl = '';
	self.canvasData = null;
//cropBoxData
	self.cropBoxData = null;// 当前激活的CropBoxData
    self.previews = null;// 

//Dalaoshe modification
	self.nowCropBoxIndex = 0;// 当前激活的CropBox下标
	self.nowCropBoxNum = 0;// 当前CropBox的数量
	self.previewBlock = null;// 当前预览框
//States 0 didnt used, 1 init, 2 has actived, 3 leave
	self.cropBoxStates = [];//new Array(); 
	self.cropBoxDatas = [];//new Array();
	self.cropBoxs = [];//new Array();
	self.viewBoxs = [];//new Array();
	self.faces = [];//new Array();
	self.previewBlocks = [];//new Array();
	self.previewCropBoxImages = [];// new Array();
//over 
	self.pointers = {};
    self.init();
  }

  init() {
    const self = this;
    const element = self.element;
    const tagName = element.tagName.toLowerCase();
    let url;

    if ($.getData(element, NAMESPACE)) {
      return;
    }

    $.setData(element, NAMESPACE, self);

    if (tagName === 'img') {
      self.isImg = true;

      // e.g.: "img/picture.jpg"
      self.originalUrl = url = element.getAttribute('src');

      // Stop when it's a blank image
      if (!url) {
        return;
      }

      // e.g.: "http://example.com/img/picture.jpg"
      url = element.src;
    } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
      url = element.toDataURL();
    }

    self.load(url);
  }

  load(url) {
    //console.log('try load:' + url);
	const self = this;
    const options = self.options;
    const element = self.element;

    if (!url) {
      return;
    }

    self.url = url;
    self.imageData = {};

    if (!options.checkOrientation || !window.ArrayBuffer) {
      self.clone();
      return;
    }

    // XMLHttpRequest disallows to open a Data URL in some browsers like IE11 and Safari
    if (REGEXP_DATA_URL.test(url)) {
      if (REGEXP_DATA_URL_JPEG.test(url)) {
        self.read($.dataURLToArrayBuffer(url));
      } else {
        self.clone();
      }
	 // console.log("REGEXP");
      return;
    }

    const xhr = new XMLHttpRequest();

    xhr.onerror = xhr.onabort = () => {
	//	console.log("xhr error");
		self.clone();
    };

    xhr.onload = () => {
	//	console.log("xhr onload");
      self.read(xhr.response);
    };

    if (options.checkCrossOrigin && $.isCrossOriginURL(url) && element.crossOrigin) {
      url = $.addTimestamp(url);
    }

    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.withCredentials = element.crossOrigin === 'use-credentials';
    xhr.send();
  }

  read(arrayBuffer) {
    const self = this;
    const options = self.options;
    const orientation = $.getOrientation(arrayBuffer);
    const imageData = self.imageData;
    let rotate = 0;
    let scaleX = 1;
    let scaleY = 1;

    if (orientation > 1) {
      self.url = $.arrayBufferToDataURL(arrayBuffer);

      switch (orientation) {

        // flip horizontal
        case 2:
          scaleX = -1;
          break;

        // rotate left 180°
        case 3:
          rotate = -180;
          break;

        // flip vertical
        case 4:
          scaleY = -1;
          break;

        // flip vertical + rotate right 90°
        case 5:
          rotate = 90;
          scaleY = -1;
          break;

        // rotate right 90°
        case 6:
          rotate = 90;
          break;

        // flip horizontal + rotate right 90°
        case 7:
          rotate = 90;
          scaleX = -1;
          break;

        // rotate left 90°
        case 8:
          rotate = -90;
          break;
		default :
		  break;
      }
    }

    if (options.rotatable) {
      imageData.rotate = rotate;
    }

    if (options.scalable) {
      imageData.scaleX = scaleX;
      imageData.scaleY = scaleY;
    }
//	console.log('read');
    self.clone();
  }

  clone() {
    const self = this;
    const element = self.element;
    const url = self.url;
    let crossOrigin;
    let crossOriginUrl;
    let start;
    let stop;

    if (self.options.checkCrossOrigin && $.isCrossOriginURL(url)) {
      crossOrigin = element.crossOrigin;

      if (crossOrigin) {
        crossOriginUrl = url;
      } else {
        crossOrigin = 'anonymous';

        // Bust cache when there is not a "crossOrigin" property
        crossOriginUrl = $.addTimestamp(url);
      }
    }

    self.crossOrigin = crossOrigin;
    self.crossOriginUrl = crossOriginUrl;

    const image = $.createElement('img');

    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }

    image.src = crossOriginUrl || url;
    self.image = image;
    self.onStart = start = $.proxy(self.start, self);
    self.onStop = stop = $.proxy(self.stop, self);

    if (self.isImg) {
      if (element.complete) {
        //console.log('complete start');
		self.start();
      } else {
        //console.log('get element start');
        //console.log(self.url);
		$.addListener(element, EVENT_LOAD, start);
		element.src = crossOriginUrl || url;
      }
    } else {
       // console.log('image start');
      $.addListener(image, EVENT_LOAD, start);
      $.addListener(image, EVENT_ERROR, stop);
      $.addClass(image, 'cropper-hide');
      element.parentNode.insertBefore(image, element.nextSibling);
    }
	//console.log('clone over');
  }

  start(event) {
    const self = this;
    const image = self.isImg ? self.element : self.image;

    if (event) {
      $.removeListener(image, EVENT_LOAD, self.onStart);
      $.removeListener(image, EVENT_ERROR, self.onStop);
    }
	//console.log('loaded');
    $.getImageSize(image, (naturalWidth, naturalHeight) => {
      $.extend(self.imageData, {
        naturalWidth,
        naturalHeight,
        aspectRatio: naturalWidth / naturalHeight,
      });

      self.loaded = true;
      self.build();
    });
  }

  stop() {
    const self = this;
    const image = self.image;

    $.removeListener(image, EVENT_LOAD, self.onStart);
    $.removeListener(image, EVENT_ERROR, self.onStop);

    $.removeChild(image);
    self.image = null;
  }

  build() {
    const self = this;
    const options = self.options;
    const element = self.element;
    const image = self.image;
    let container;
    let cropper;
    let canvas;
    let dragBox;
    if (!self.loaded) {
	//	console.log('didnit loaded');
		return;
    }

    // Unbuild first when replace
    if (self.ready) {
      self.unbuild();
    }

    const template = $.createElement('div');
    template.innerHTML = TEMPLATE;

    // Create cropper elements
    self.container = container = element.parentNode;
	self.cropper = cropper = $.getByClass(template, 'cropper-container')[0];
	self.canvas = canvas = $.getByClass(cropper, 'cropper-canvas')[0];
    self.dragBox = dragBox = $.getByClass(cropper, 'cropper-drag-box')[0];
   

//dalaoshe modification	
	let cropBoxs;
	let viewBoxs;
	let faces = [];
	cropBoxs = $.getByClass(cropper, 'cropper-crop-box'); 
	viewBoxs = $.getByClass(cropper, 'cropper-view-box');
	for(let i = 0; i < cropBoxs.length; ++i) {
		self.cropBoxs[i] = cropBoxs[i];
		self.viewBoxs[i] = viewBoxs[i];
	}
	for(let i = 0; i < cropBoxs.length; ++i) {
		let box_face = $.getByClass(cropBoxs[i], 'cropper-face')[0];
		faces[i] = box_face;
		self.cropBoxStates[i] = 0;
	}
	self.faces = faces;
	if(cropBoxs.length > 0) {
	//	console.log("has init cropBox");
		self.cropBoxStates[0] = 1;
	}
//over

    $.appendChild(canvas, image);
    // Hide the original image
    $.addClass(element, CLASS_HIDDEN);

    // Inserts the cropper after to the current image
    container.insertBefore(cropper, element.nextSibling);

    // Show the image if is hidden
    if (!self.isImg) {
      $.removeClass(image, 'cropper-hide');
    }

    //self.initPreview();
    
	self.initAllCropBoxsPreview();
	self.bind();

    options.aspectRatio = Math.max(0, options.aspectRatio) || NaN;
    options.viewMode = Math.max(0, Math.min(3, Math.round(options.viewMode))) || 0;

    
	
	if (options.autoCrop) {
      if (options.modal) {
        $.addClass(dragBox, 'cropper-modal');
      }
    } else {
	  for(let i = 0; i < cropBoxs.length; ++i) {
		$.addClass(cropBoxs[i], CLASS_HIDDEN);
	  }
    }

    if (!options.guides) {
      // dalaoshe modification
	  for(let i = 0; i < cropBoxs.length; ++i) {
		$.addClass($.getByClass(cropBoxs[i], 'cropper-dashed'), CLASS_HIDDEN);
	  }
    }

    if (!options.center) {
	  for(let i = 0; i < cropBoxs.length; ++i) {
		$.addClass($.getByClass(cropBoxs[i], 'cropper-center'), CLASS_HIDDEN);
	  }
    }

    if (options.background) {
      $.addClass(cropper, 'cropper-bg');
    }

    if (!options.highlight) {
	  for(let i = 0; i < faces.length; ++i) {
		$.addClass(faces[i], 'cropper-invisible');
	  }
    }

    if (options.cropBoxMovable) {
	  for(let i = 0; i < faces.length;  ++i) {
		$.addClass(faces[i], 'cropper-move');
		$.setData(faces[i], 'action', 'all');
	  }
    }

    if (!options.cropBoxResizable) {
	  for(let i=0; i < cropBoxs.length; ++i) { 
		$.addClass($.getByClass(cropBoxs[i], 'cropper-point'), CLASS_HIDDEN);
		$.addClass($.getByClass(cropBoxs[i], 'cropper-point'), CLASS_HIDDEN);
	  }
    }

    self.setDragMode(options.dragMode);
    self.render();
    self.ready = true;
    self.setData(options.data);

    // Call the "ready" option asynchronously to keep "image.cropper" is defined
    self.completing = setTimeout(() => {
      if ($.isFunction(options.ready)) {
        $.addListener(element, EVENT_READY, options.ready, true);
      }

      $.dispatchEvent(element, EVENT_READY);
      $.dispatchEvent(element, EVENT_CROP, self.getData());
	  
	

      self.complete = true;
	  //dalaoshe modification
	  $.addClass(dragBox, 'cropper-modal');
	  $.dispatchEvent(self.cropper, 'buildover', {});
    // console.log('build over'); 
	  if(self.options.autoCrop) {
		 self.cropped = options.autoCrop;
		 self.createNewCropperBox();
	  }
	  //over
	  
	}, 0);
  }

  unbuild() {
    const self = this;

    if (!self.ready) {
      return;
    }

    if (!self.complete) {
      clearTimeout(self.completing);
    }
	//console.log('unbuild');
    self.ready = false;
    self.complete = false;
    self.initialImageData = null;

    // Clear `initialCanvasData` is necessary when replace
    self.initialCanvasData = null;
    self.initialCropBoxData = null;
    self.containerData = null;
    self.canvasData = null;

    // Clear `cropBoxData` is necessary when replace
    self.cropBoxData = null;
    self.unbind();

    self.resetPreview();
    self.previews = null;

    self.viewBox = null;
    self.cropBox = null;
    self.dragBox = null;
    self.canvas = null;
    self.container = null;

    $.removeChild(self.cropper);
    self.cropper = null;

	//dalaoshemodification
	for(let i = 0; i < self.previewBlocks.length; ++i) {
		$.removeChild(self.previewBlocks[i]);
	}
	self.cropBoxStates.splice(0, self.cropBoxStates.length);
	self.cropBoxs.splice(0, self.cropBoxs.length);
	self.viewBoxs.splice(0, self.viewBoxs.length);
	self.faces.splice(0, self.faces.length);
	self.previewBlocks.splice(0, self.previewBlocks.length);
	self.previewCropBoxImages.splice(0, self.previewCropBoxImages.length);
	self.cropBoxDatas.splice(0, self.cropBoxDatas.length);
	self.nowCropBoxIndex = 0;
	self.nowCropBoxNum = 0;
	self.previewBlock = null;
	//over
	//console.log('unbuild ok');
  }

  static noConflict() {
    window.Cropper = AnotherCropper;
    return Cropper;
  }

  static setDefaults(options) {
    $.extend(DEFAULTS, $.isPlainObject(options) && options);
  }
}

$.extend(Cropper.prototype, render);
$.extend(Cropper.prototype, preview);
$.extend(Cropper.prototype, events);
$.extend(Cropper.prototype, handlers);
$.extend(Cropper.prototype, change);
$.extend(Cropper.prototype, methods);

if (typeof window !== 'undefined') {
  AnotherCropper = window.Cropper;
  window.Cropper = Cropper;
}

export default Cropper;
