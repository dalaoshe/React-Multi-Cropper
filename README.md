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
### Demo


## Support React Props

### newcropbox
- Type:`Function`  
- Default:`null` 

A callback function of event `newcropbox`  

### cropboxchange
- Type:`Function`   
- Default:`null`

A callback function of event `cropboxchange`  

### destroycropbox
- Type:`Function`   
- Default:`null`

A callback function of event `destroycropbox`  

### cropboxchange
- Type:`Function`   
- Default:`null`

A callback function of event `cropboxchange`  

### renderCropBox
- Type:`Function`  
- Params: 
  - datas: 
    - type: `Array of cropboxdata object`  
  array of all cropboxdatas   
  - images:  
    - type: `Array of cropbox dom`  
  array of all cropboxs preview dom  
  - params:   
    - type: `Object`  
  the params props of this component  
- Default:`null`

A custom function to render cropbox data info  

### params
- Type: `Object`  
- Default: `null`

A params provided by user for custom function  


## Support Methods

### destroyCropBoxByIndex   
- index:  
  - type: `int`  
    index of the cropbox to be destroy
    
Destroy the cropbox in cropboxs array by its index  

### activeCropBoxByIndex  
  - Params: 
  - index:  
    - type: `int`    
    index of the cropbox to be active       

Active the cropbox in cropboxs array by its index  

### createCropBox  
- Params: no params     

Active the cropbox in cropboxs array by its index   

### setNowCropperBoxData
- Params: 
  - data: 
    - type:`Object of cropboxdata`          

Set the cropboxdata of actived cropbox

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
