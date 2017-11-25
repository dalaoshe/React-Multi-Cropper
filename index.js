import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// import antd component to renderCropBox, you can use any other component you want
import {Select, Card, Input, Button } from 'antd';  
import 'antd/dist/antd.css';

// import our multi-cropper component
import Cropper from './multi-cropper/cropper';
import * as $ from './multi-cropper/src/js/utilities';// import some wrapped method from multi-cropper

import registerServiceWorker from './registerServiceWorker';


const Option = Select.Option;

/**
* A simple demo use multi-cropper 
*/
class Demo extends Component {
  constructor(props) {
    super(props);
	// In ES6 must bind(this) to use this reference in function
	// You can use arrow function to skip bind 
	this.renderCropBox = this.renderCropBox.bind(this);
	this.newCropBox = this.newCropBox.bind(this);
	this.destroyCropBox = this.destroyCropBox.bind(this);
  }
  
  /** 
  * event callback when a new cropbox created, you can do something here
  */  
  newCropBox(event) {
	this.forceUpdate();
  }
  /** 
  * event callback when a cropbox destroyed, you can do something here
  */  
  destroyCropBox(event) {
	this.forceUpdate();
  }
  /** 
  * event callback when a new cropbox end move, you can do something here
  */  
  moveEnd = (event) => {
	this.forceUpdate();
  }
  
  /**
  *  event callback when cropper build, you can create the begin cropbox here
  */  
  cropBuildOver = (event) => {
	// initial two cropbox
	let datas = [];
	datas[0] = {
		x: 20,
		y: 20,
		height: 40,
		width: 40
	}	
	datas[1] = {
		x: 150,
		y: 150,
		height: 400,
		width: 200
	}	
	for(let i = 0; i < 2; ++i) {
		let data = datas[i];
		this.cropper.createCropBox();
		this.cropper.setNowCropperBoxData(data);
	}
	this.forceUpdate();
  }

  render() {
    return (
        <div style={{ width: '100%' }} align={'center'}>
			<Cropper
				style={{ height: 800, width: '100%' }}
				autoCrop={false}
				autoCropArea={0.3}	
				guides={true}
				movable={false}
				scalable={false}
				rotatable={false}
				zoomable={false}
				cropend={this.moveEnd}
				newcropbox={this.newCropBox}
				destroycropbox={this.destroyCropBox}
				renderCropBox={this.renderCropBox}
				buildover={this.cropBuildOver}	
				params={{
					types:['woman', 'dog', 'cat'],
				}}
				src={'https://img10.360buyimg.com/n5/s500x640_jfs/t7687/164/1418188723/543130/fd1af88e/599ce253N071b3037.png!cc_50x64.jpg'}
				ref={cropper => { this.cropper = cropper; }}
			/>
        </div>
    );
  }
  
  handleToDestroyCropBox = (event) => {
	let e = $.getEvent(event);
	let target = e.target;
	let index = target.getAttribute('cropboxindex');
	e.preventDefault();
	if(this.cropper != null && index != null) {
		this.cropper.destroyCropBoxByIndex(parseInt(index, 10));
		e.stopPropagation();
	}
  }

  handleToActiveCropBox = (event) => {
	let e = $.getEvent(event);
	let target = e.target;
	let index = target.getAttribute('cardindex');
	if(target.type === 'button') {
		console.log('active button');
		return;
	}
	while(index == null) {
		target = target.parentNode;
		if(target == null) break;
		index = target.getAttribute('cardindex');
	}
	if(this.cropper != null && index != null) {
		this.cropper.activeCropBoxByIndex(parseInt(index, 10));
	}
  }

  /**
  *  example of renderoCropBox, display position info and preview img dom of every cropbox
  *  datas: CropBoxData Array
  *  images: CropBox Preview Dom(<img />)
  *  params: the params props of Cropper Component
  */
  renderCropBox(datas, images, params) {
		if(	datas == null || datas.length === 0 ||
			images == null|| images.length === 0 ||
			params.types === null || 
				params === null){
			return ( <div> </div>);
		}

		let types = params.types; 
		let res = [];
		let options = [];
		for(let i = 0; i < types.length; ++i) {
			options.push(	
				<Option key={types[i]} value={types[i]}>{types[i]}</Option>);
		}

		for(let i = 0; i < datas.length; ++i) {
			let data = datas[i];
			let selectDisable = (types.length === 1)  
			let actived = this.cropper.getNowCropBoxIndex() === i;
			let displaycolor = actived ? '#00A0E9'  : 'white';
			res.push(
			<div style={{clear:'both'}} key={i} onClick={this.handleToActiveCropBox} cardindex={i} >
				{/* Use Antd Card To Render Every CropBox Info */}
				<Card style={{width:500, height: 256, float:'left', background:displaycolor}}>			  
				  <div 
					style={{width:'100%', height:'100%'}} 	
					>
					  <div style={{'textAlign':'center', width:'100%'}}>
						<p>{'CROPBOX ID:' + i} </p> 
						<Button cropboxindex={i}
							type="primary" onClick={this.handleToDestroyCropBox} >
							Delete
						</Button>
					  </div>
				       
					  {/* Preview CropBox Img */} 
					  <div style={{float:'left', width:'60%'}}>
						  <div className="cimg-preview-block" 
							 style={{ width: '100%', height: 128, overflow:'hidden'}} 
							 align={'center'}
							 dangerouslySetInnerHTML=
								{{ __html:images[i].outerHTML}} />
					  </div>
							
					  <div style={{float:'right', width:'40%'}}>
				          {/* Display CropBox Position Info */}	  
						  <div style={{clear:'both', width:'100%', }}>
							<label style={{width:'10%',float:'left'}}>X</label>
							<Input readOnly='true' style={{width:'80%', float:'left'}} size='small' value={data.x}/>
							<span style={{width:'10%',float:'left'}}>PY</span>
						  </div>
						  
						  <div style={{clear:'both', width:'100%', }}>
							<label style={{width:'10%',float:'left'}}>Y</label>
							<Input readOnly='true' style={{width:'80%', float:'left'}} size='small' value={data.y}/>
							<span style={{width:'10%',float:'left'}}>PY</span>
						  </div>
						  
						  <div style={{clear:'both', width:'100%', }}>
							<label style={{width:'10%',float:'left'}}>W</label>
							<Input readOnly='true'  style={{width:'80%', float:'left'}} size='small' value={data.width}/>
							<span style={{width:'10%',float:'left'}}>PY</span>
						  </div>
						 
						  <div style={{clear:'both', width:'100%', }}>
							<label style={{width:'10%',float:'left'}}>H</label>
							<Input readOnly='true'  style={{width:'80%', float:'left'}} size='small' value={data.height}/>
							<span style={{width:'10%',float:'left'}}>PY</span>
						  </div>
						  {/* Render A Antd Select */}	
						  <div style={{clear:'both', width:'100%' }}>
							<Select 
								disabled={selectDisable}
								mode="multiple"
								style={{ width: '100%' }}
								placeholder="Select a Type"
								optionFilterProp="children"
								filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
							>{options}</Select>
						  </div>
	
					  </div>
				  </div>
				</Card>
			</div>);
		}
		return (<div style={{clear: 'both', width:'100%', float:'left'}}>
					{res} 
				</div>);
  }
}
ReactDOM.render(
<Demo />,
document.getElementById('root')
		);
registerServiceWorker();

