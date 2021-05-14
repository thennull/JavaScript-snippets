#!/usr/bin/env node


"use strict";

//Imports
import * as path from 'path';
import * as fs from 'fs';
import minimist from 'minimist';
import * as stepIn from 'stream';
import zlib from 'zlib';

// Mensagem de suporte a variáveis

// Linux: basta usar o comando export para preparar as variáveis de ambiente

var BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);
var OUTFILE = path.join(BASE_PATH, "out.txt");

var args = minimist(process.argv.slice(2), {
  boolean: ["help", "in", "out", "uncompress"],
  string: [ "file" ]
});

function printHelp(){
  console.log('This script usage:');
  console.log("");
  console.log("command --help");
  console.log('command --file={FILENAME}');
  console.log("");
  console.log("--help           print this help");
  console.log('--file           process the file');
  console.log("");
  console.log("--in, -          process stdin");
  console.log("");
  console.log("--out            process to a local file 'out.txt'");
  console.log("");
  console.log("--compress       gzip the output");
  console.log("");
  console.log("--uncompress     un-gzip the input");
  console.log("");
}

// Main: controle

if(args.help){
  console.log("");
  printHelp();
} else if(args.file) {
  let stream = fs.createReadStream(path.join(BASE_PATH, args.file));
  processFile(stream).then(() => console.log('\nComplete!')).catch(error);
} else if (args.in || args._.includes("-")){
  processFile(process.stdin).then(() => console.log('\n complete!')).catch(error);
}else {
  error('Incorrect usage!',true);
}

// Functions and helpers

function streamComplete(stream){
  return new Promise(function (res){
    stream.on("end", res);
  });
}

function error(msg, includeHelp = false){
  console.error(msg);
  if(includeHelp){
    console.log("");
    printHelp();
  }
}

async function processFile(inStream){
  var outStream = inStream;

  if(args.uncompress){
    let gunzipStream = zlib.createGunzip();
    outStream = outStream.pipe(gunzipStream);
  }

  // Acessa a stream e captura o buffer
  var upperStream = new stepIn.Transform({
    transform(chunk,enc,cb){
      this.push(chunk.toString().toUpperCase());
      //Se ativado adiciona um delay para 65Kb processados do buffer
      // setTimeout(cb,500);
      cb();
    }
  });

  outStream = outStream.pipe(upperStream);
  let targetStream;

  if(args.compress){
    console.log('here')
    let gzipStream = zlib.createGzip();
    outStream = outStream.pipe(gzipStream);
    OUTFILE = `${OUTFILE}.gz`;
  }

  if(args.out)
    targetStream = fs.createWriteStream(OUTFILE);
  else 
    targetStream = process.stdout;
    
  outStream.pipe(targetStream);

  await streamComplete(outStream);
  
}
