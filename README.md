# React-Multi-Cropper



## Feature

## Require
- `node` >= v8.0 [install by git hub](https://github.com/nodejs/node/blob/master/BUILDING.md)  
- `creat-react-app` >= 1.4.0  
- `npm` >= 5.0


## Getting Start
### Install
Install `Node` and `npm` first, then execute follow command to install `create-react-app`
```
npm install create-react-app -g
```
### Quick Example
Creat a new react app by follow commad:
```
create-react-app multi-cropper-app
```
Then you will get a dir as follow:
```
├── node_modules
├── package.json
├── package-lock.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── README.md
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    └── registerServiceWorker.js
```
Then use our `index.js` replace the index.js in `src`, copy our `multi-cropper` dir to `src`, run:
```
npm start
```

Either, you skip all the steps before and can run our build.sh to create the demo app
```
./build.sh
cd ~/multi-react-cropper
npm start
```

### Demo


## Support React Props

### buildover
- Type:`Function`   
- Default:`null`
- Desc: A callback function of event `buildover`, happen when the cropper built and ready for create cropbox  

### newcropbox
- Type:`Function`  
- Default:`null` 
- Desc: A callback function of event `newcropbox`, happen when a cropbox has been created     

### destroycropbox
- Type:`Function`   
- Default:`null`
- Desc: A callback function of event `destroycropbox`, happen when a cropbox has been destroyed  

### cropboxchange
- Type:`Function`   
- Default:`null`
- Desc: A callback function of event `cropboxchange`, happen when the actived cropbox changed      

### renderCropBox
- Type:`Function`  
- Params: 
  - datas: 
    - type: `Array of cropboxdata object`  
    - desc: array of all cropboxdatas   
  - images:  
    - type: `Array of cropbox dom`  
    - desc: array of all cropboxs preview dom  
  - params:   
    - type: `Object`  
    - desc: the params props of this component  
- Default:`null`
- Desc: A custom function to render cropbox data info  

### params
- Type: `Object`  
- Default: `null`
- Desc: A params provided by you for renderCropbox function  


## Support Methods

### createCropBox       
- Desc: Create a new cropbox

### destroyCropBoxByIndex   
- Params:
  - index:  
    - type: `int`  
    - desc: index of the cropbox to be destroy   
- Desc: Destroy the cropbox in cropboxs array by its index  

### activeCropBoxByIndex  
- Params: 
  - index:  
    - type: `int`    
    - desc:index of the cropbox to be active       
- Desc: Active the cropbox in cropboxs array by its index  

### setNowCropperBoxData
- Params: 
  - data: 
    - type:`Object of cropboxdata`          
    - desc:position data array to set  
- Desc: Set the cropboxdata of now actived cropbox

##For Developer
### Source Code
```text
├── cropper.js
└── src
    ├── css
    │   └── cropper.css
    ├── images
    │   └── bg.png
    └── js
        ├── change.js
        ├── cropper.js
        ├── defaults.js
        ├── events.js
        ├── handlers.js
        ├── methods.js
        ├── preview.js
        ├── render.js
        ├── template.js
        └── utilities.js

```
