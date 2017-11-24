# React-Multi-Cropper


## Props

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
  -Type: `Object`  
  -Default: `null`  
A params provided by user for custom function  


## Methods

### destroyCropBoxByIndex  
- Params: 
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
    - type: `Object of cropboxdata`        
Set the cropboxdata of actived cropbox

