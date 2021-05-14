function streamWrapper(stream){
  return new Promise(function(res,rej){
    stream.on("end", function(){
      your logic goes here!!
        res();
      or
        rej();
      });
    });
  }
