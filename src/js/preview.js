import * as $ from './utilities';

const DATA_PREVIEW = 'preview';

export default {
  initPreview() {
	const self = this;
    const preview = self.options.preview;
    const image = $.createElement('img');
    const crossOrigin = self.crossOrigin;
    const url = crossOrigin ? self.crossOriginUrl : self.url;

    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }

    image.src = url;
    $.appendChild(self.viewBox, image);
    self.image2 = image;

    if (!preview) {
      return;
    }

    const previews = preview.querySelector ? [preview] : document.querySelectorAll(preview);

    self.previews = previews;

    $.each(previews, (element) => {
      const img = $.createElement('img');

      // Save the original size for recover
      $.setData(element, DATA_PREVIEW, {
        width: element.offsetWidth,
        height: element.offsetHeight,
        html: element.innerHTML,
      });

      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }

      img.src = url;

      /**
       * Override img element styles
       * Add `display:block` to avoid margin top issue
       * Add `height:auto` to override `height` attribute on IE8
       * (Occur only when margin-top <= -height)
       */

      img.style.cssText = (
        'display:block;' +
        'width:100%;' +
        'height:auto;' +
        'min-width:0!important;' +
        'min-height:0!important;' +
        'max-width:none!important;' +
        'max-height:none!important;' +
        'image-orientation:0deg!important;"'
      );

      $.empty(element);
      $.appendChild(element, img);
    });
  },

  resetPreview() {
    $.each(this.previews, (element) => {
      const data = $.getData(element, DATA_PREVIEW);

      $.setStyle(element, {
        width: data.width,
        height: data.height,
      });

      element.innerHTML = data.html;
      $.removeData(element, DATA_PREVIEW);
    });
  },

  preview() {
    const self = this;
    const imageData = self.imageData;
    const canvasData = self.canvasData;
    const cropBoxData = self.cropBoxData;
    const cropBoxWidth = cropBoxData.width;
    const cropBoxHeight = cropBoxData.height;
    const width = imageData.width;
    const height = imageData.height;
    const left = cropBoxData.left - canvasData.left - imageData.left;
    const top = cropBoxData.top - canvasData.top - imageData.top;

    if (!self.cropped || self.disabled) {
      return;
    }

    $.setStyle(self.image2, $.extend({
      width,
      height,
    }, $.getTransforms($.extend({
      translateX: -left,
      translateY: -top,
    }, imageData))));

    $.each(self.previews, (element) => {
      const data = $.getData(element, DATA_PREVIEW);
      const originalWidth = data.width;
      const originalHeight = data.height;
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      let ratio = 1;

      if (cropBoxWidth) {
        ratio = originalWidth / cropBoxWidth;
        newHeight = cropBoxHeight * ratio;
      }

      if (cropBoxHeight && newHeight > originalHeight) {
        ratio = originalHeight / cropBoxHeight;
        newWidth = cropBoxWidth * ratio;
        newHeight = originalHeight;
      }

      $.setStyle(element, {
        width: newWidth,
        height: newHeight,
      });

      $.setStyle($.getByTag(element, 'img')[0], $.extend({
        width: width * ratio,
        height: height * ratio,
      }, $.getTransforms($.extend({
        translateX: -left * ratio,
        translateY: -top * ratio,
      }, imageData))));
    });
  },
//dalaoshe modification
  previewEveryCropBox() {
    const self = this;
    const imageData = self.imageData;
    const canvasData = self.canvasData;
	const cropBoxDatas = self.cropBoxDatas;
	const image2s = self.previewCropBoxImages;
	const previews = self.previewBlocks;
	const states = self.cropBoxStates;
	for(let cropBox_id = 0; cropBox_id < self.cropBoxs.length; ++cropBox_id) {
		let cropBoxData = cropBoxDatas[cropBox_id];
		let image2 = image2s[cropBox_id];
		let element = previews[cropBox_id];
		let cropState = states[cropBox_id];
		if(cropState === 0) {
			continue;
		}
		else if(cropState === 1){
			self.displayActiveCropperBox(cropBox_id);
			self.cropBoxStates[cropBox_id] = 2;
		}
		const cropBoxWidth = cropBoxData.width;
		const cropBoxHeight = cropBoxData.height;
		const width = imageData.width;
		const height = imageData.height;
		const left = cropBoxData.left - canvasData.left - imageData.left;
		const top = cropBoxData.top - canvasData.top - imageData.top;
		if (!self.cropped || self.disabled) {
			continue;
		}
	//	console.log("\n\n");
	//	console.log(image2);
	//	console.log(element);
	//	console.log(JSON.stringify(element));
		$.setStyle(image2, $.extend({
			width,
			height,
		}, $.getTransforms($.extend({
			translateX: -left,
			translateY: -top,
		}, imageData))));
		{
			const data = $.getData(element, DATA_PREVIEW);

			const originalWidth = data.width;
			const originalHeight = data.height;
			let newWidth = originalWidth;
			let newHeight = originalHeight;
			let ratio = 1;
			if (cropBoxWidth) {
				ratio = originalWidth / cropBoxWidth;
				newHeight = cropBoxHeight * ratio;
			}

			if (cropBoxHeight && newHeight > originalHeight) {
				ratio = originalHeight / cropBoxHeight;
				newWidth = cropBoxWidth * ratio;
				newHeight = originalHeight;
			}
			$.setStyle(element, {
				width: newWidth,
				height: newHeight,
			});
			$.setStyle($.getByTag(element, 'img')[0], $.extend({
				width: width * ratio,
				height: height * ratio,
			}, $.getTransforms($.extend({
				translateX: -left * ratio,
				translateY: -top * ratio,
			}, imageData))));
		}
	}
  },
  // 初始化所有已有的CropBox
  initAllCropBoxsPreview() {
	const self = this;
	for(let i = 0; i < self.cropBoxs.length; ++i) {
		let viewBox = self.viewBoxs[i];
		let cropBox = self.cropBoxs[i];
		let face = self.faces[i];
		self.initNewCropBoxPreview(i, cropBox, viewBox, face);
		self.initCropBoxChangeBindEvent(i);
	}

	if(self.cropBoxs.length > 0) {
		self.cropBoxStates[0] = 1;
		self.image2 = self.previewCropBoxImages[0];
		self.activeCropperBox(0);
	}
  },
  // 初始化PreviewBlock对应的Image的信息
  initPreviewImage(element, crossOrigin, url) {
      const img = $.createElement('img');
	  $.setData(element, DATA_PREVIEW, {
        width: parseInt(element.getAttribute('defaultoffsetwidth'), 10),
        height: parseInt(element.getAttribute('defaultoffsetheight'), 10),
        html: element.innerHTML,
      });
      if (crossOrigin) {
        img.crossOrigin = crossOrigin;
      }

      img.src = url;

      /**
       * Override img element styles
       * Add `display:block` to avoid margin top issue
       * Add `height:auto` to override `height` attribute on IE8
       * (Occur only when margin-top <= -height)
       */
      
	  img.style.cssText = (
        'display:block;' +
        'width:100%;' +
        'height:auto;' +
        'min-width:0!important;' +
        'min-height:0!important;' +
        'max-width:none!important;' +
        'max-height:none!important;' +
        'image-orientation:0deg!important;"'
      );
	  

      $.empty(element);
      $.appendChild(element, img);
  },
//over
};
