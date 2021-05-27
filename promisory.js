Promise.wrap = function (fn){
  return function (){
    let args = [].slice.call(arguments);
    
    return new Promise(
      function (resolve,reject){
        fn.apply(
          null,
          args.concat(
            function (error, success){
              if(error)
                reject(error);
              else
                resolve(success);
          })
        );
      });
  };
}
