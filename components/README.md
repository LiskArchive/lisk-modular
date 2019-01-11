## Components

Components are the objects which can be used as shared objects for some common logic. The idea for the component is as: 

1. It should be deterministic, on providing same configuration it should generate `instance` of component that behaves exactly the same way. 
2. Creating component instance should be straight forward and easy.
3. The configuration of the component should be composed of `json` object and must be descriptive.
4. One component can use multiple underlying libraries, and that's where `factory method` will be useful. It will take `json configuration` initialize the libraries in one particular way and provide us the instance. 
5. The default `require` must expose just the factory method.
6. Each factory method must accept only `two` parameters, one is the configuration and other would be the logger.  

To read further on `factory method` see this [link](http://robdodson.me/javascript-design-patterns-factory/) 

#### Example            

Consider we are creating a component named `system`. Its `package.json` file points to below file under `main` entry point.   

```js
const System = require('src/system');

module.exports = function createSystem(config, logger) {
    config.logger = logger; 
    return new System(config);
}; 
```

The implementation of actual behavior of component is not restricted by any pattern. You can use ES6 OO Objects or plain javascript how ever you want.   
