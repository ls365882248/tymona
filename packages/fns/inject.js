class Injector {
  providerMap = new Map();
  instanceMap = new Map();

  getProvider(key){
    return this.providerMap.get(key);
  }
  setProvider(key, value) {
    if(!this.providerMap.has(key)) {
      this.providerMap.set(key, value);
    }
  }

  getInstance(key) {
    return this.instanceMap.get(key);
  }
  setInstance(key, val) {
    if(!this.instanceMap.has(key)) {
      this.instanceMap.set(key, val);
    }
  }
}

const injector = new Injector();

function Injectable(_constructor) {
  return (_constructor) => {
    injector.setProvider(_constructor, _constructor);
    return _constructor;
  }
}

// @Inject() public clothes: Clothes;
function Inject(_constructor, key) {
  return (_constructor, key) => {
    const propertyType = Reflect.getMetadata('design:type', _constructor, key);
    const instance  = injector.getInstance(propertyType);
    _constructor[key] = instance;
    return injector.getProvider(key);
  }
}