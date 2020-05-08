const MyKoa = require('./mykoa');

const app = new MyKoa();
app.use(async function(ctx, next) {
  console.log('first function');
  await next();
});
app.use(async function(ctx, next) {
  await new Promise(function(resolve) {
    console.log('settimeout');
    setTimeout(resolve, 1000);
  });
  next();
  console.log('settimeout1');
});

async function check(ctx, next) {
  console.log('check');
  await new Promise(function(resolve) {
    setTimeout(resolve, 1000);
  });
  next();
}

app.use('/test', check, async function(ctx, next) {
  console.log('test use');
  next();
});

app.use(async function(ctx, next) {
  console.log(3);
  next();
});

app.use('/test/get', async function(ctx, next) {
  console.log('test get');
  ctx.res.end('test get end');
});

app.use(async function(ctx, next) {
  ctx.res.end('end');
});

module.exports = app;
