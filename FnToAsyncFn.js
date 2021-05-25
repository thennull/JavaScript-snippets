//  Wrap a funtion with a trustable promise making that function Async

function sum(v1, v2){
  return(v1 + v2);
}

function promisify(fn){
  let args = [].slice.call(arguments);

  return Promise.resolve(fn.apply(null,args.slice(1)));
}

promisify(sum,20,40).then(result => console.log(result));
