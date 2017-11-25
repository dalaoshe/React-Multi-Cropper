const crop_box_template =
    '<div class="cropper-crop-box">' +
      '<span class="cropper-view-box"></span>' +
      '<span class="cropper-dashed dashed-h"></span>' +
      '<span class="cropper-dashed dashed-v"></span>' +
      '<span class="cropper-center"></span>' +
      '<span class="cropper-face"></span>' +
      '<span class="cropper-line line-e" data-action="e"></span>' +
      '<span class="cropper-line line-n" data-action="n"></span>' +
      '<span class="cropper-line line-w" data-action="w"></span>' +
      '<span class="cropper-line line-s" data-action="s"></span>' +
      '<span class="cropper-point point-e" data-action="e"></span>' +
      '<span class="cropper-point point-n" data-action="n"></span>' +
      '<span class="cropper-point point-w" data-action="w"></span>' +
      '<span class="cropper-point point-s" data-action="s"></span>' +
      '<span class="cropper-point point-ne" data-action="ne"></span>' +
      '<span class="cropper-point point-nw" data-action="nw"></span>' +
      '<span class="cropper-point point-sw" data-action="sw"></span>' +
      '<span class="cropper-point point-se" data-action="se"></span>' +
    '</div>';

const preview_img_template = 
            '<div class="img-preview-item"' +
			'style="width:100px;' +
				'align: center;' +
				'height: 100px; ' +
				'overflow:hidden" '+
			'defaultoffsetwidth=320 ' +
			'defaultoffsetheight=128'+
			'	> ' +
			'</div>';


const multi_template =
  //'<div class="cropper-div" tabindex="1">' + 
  '<div class="cropper-container" tabindex="-1">' +
    '<div class="cropper-wrap-box">' +
      '<div class="cropper-canvas"></div>' +
    '</div>' +
    '<div class="cropper-drag-box" tabindex="-1"></div>' +
  //	crop_box_template +
  //'</div>'+
  '</div>';

export const CROP_BOX_TEMPLATE = crop_box_template;
export const PREVIEW_IMG_TEMPLATE = preview_img_template;
export default (
	multi_template
);
