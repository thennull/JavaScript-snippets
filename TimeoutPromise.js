function timeoutPromise(delay){
  return new Promise(function (resolve,reject){
    setTimeout(function (){
      reject("Timeout!");
    }, delay);
  });
  
Promise.race([AsyncToDo(), timeoutPromise(2000)]) 
  .then(
     function (){
       // AsyncToDo() ... fulfilled ?!
     },
     function(err){
      // didn't finish in time ... or error! 
     }
 );
