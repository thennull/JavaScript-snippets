function streamWrapper(stream){
  return new Promise(function(res,rej){
    stream.on("end", function(){
        res();
      // Just a template....
        rej();
      });
    });
  }
