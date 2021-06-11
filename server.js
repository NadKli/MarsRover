//...
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var express=require('express');
var app=express();
var http=require('http').Server(app);
var io=require('socket.io')(http);
const router=express.Router();
const path=require('path');
const port = new SerialPort('COM3', { baudRate: 115200 });
const parser = port.pipe(new Readline({ delimiter: '\n' }));

app.use(express.static(__dirname+'/SiteTest'));

app.get('/home',function(req,res){
    res.sendFile(path.join(__dirname+'/SiteTest/Home.html'));
});
app.get('/stream',function(req,res){
    res.sendFile(path.join(__dirname+'/SiteTest/Live-Feed.html'));
});
app.get('/contact',function(req,res){
    res.sendFile(path.join(__dirname+'/SiteTest/Contact.html'));
});

var Distance;

port.on("open", () => {
    console.log('serial port open');
  });
parser.on('data', data =>{
    console.log('got word from arduino:', data);
    Distance = data; 
  });

var Temperature = 30;   //Now we do the same with what comes from the serial port
var Humidity = 200;
io.sockets.on('connection',function(socket){
        io.sockets.emit('Distance',{Distance:Distance});
})
http.listen(1234,function(){
    console.log('listen on :1234');
})

