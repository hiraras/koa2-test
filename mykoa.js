
const querystring = require('querystring');
class MyKoa {
  constructor() {
    this.fnMap = new Map();
    this.key = 0;
  }
  use(...args) {
    const arg1 = args[0];
    if (typeof arg1 === 'string') {
      this.fnMap.set(arg1, args.slice(1));
      // koa2 不涉及路由，但是这里为了测试方便与目的是了解实现故先保留
      // throw new Error('argument is not a funciton');
    } else {
      this.fnMap.set(this.key, args);
      this.key ++;
    }
  }
  createContext(req, res) {
    const ctx = { req, res };
    ctx.query = req.query;
    return ctx;
  }
  callback() {
    return async (req, res) => {
      const url = req.url;
      const path = url.split('?')[0];
      const fnList = this.getFnList(path);
      const ctx = this.createContext(req, res);
      if (path.includes('icon')) {
        return ;
      }
      exec(ctx, fnList);
    }
  }
  getFnList(path) {
    const keys = this.fnMap.keys();
    const list = [];
    for (let key of keys) {
      if (typeof key === 'number') {
        list.push(...this.fnMap.get(key));
      } else if (path.includes(key)) {
        list.push(...this.fnMap.get(key));
      }
    }
    return list;
  }
}

function exec(ctx, fnList) {
  function f() {
    const fn = fnList.shift();
    fn && fn(ctx, f);
  }
  f();
}

// 教程实现
const compose = function(middlewareList) {
  return function(ctx) {
    function dispatch(i) {
      const fn = middlewareList[i];
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    dispatch(0);
  }
}

module.exports = MyKoa;
