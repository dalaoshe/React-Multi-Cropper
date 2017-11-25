import React from 'react';
import ReactDOM from 'react-dom';
import Cropper from './multi-cropper/cropper';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
<div style={{ height:1000, width:1000, float:'center', textAlign: 'center' }}>
	<Cropper
		style={{ height: 800, width: '100%' }}
		autoCrop={false}
		autoCropArea={0.3}	
		guides={true}
		movable={false}
		scalable={false}
		rotatable={false}
		zoomable={false}
		params={{}}
		src={'https://img10.360buyimg.com/n5/s500x640_jfs/t7687/164/1418188723/543130/fd1af88e/599ce253N071b3037.png!cc_50x64.jpg'}
	
	/>
</div>,
document.getElementById('root')
		);
registerServiceWorker();
