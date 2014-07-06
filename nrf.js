var tessel = require('tessel');
var NRF24  = require('rf-nrf24');
var pipes  = [0xF0F0F0F0E1, 0xF0F0F0F0D2];

var nrf = NRF24.channel(0x4c);
nrf.transmitPower('PA_MAX');
nrf.dataRate('1Mbps');
nrf.crcBytes(2);
nrf.use(tessel.port['C']); // Change this depending on what port you plug the NRF module into

nrf._debug = false;

var rx = nrf.openPipe('rx', pipes[0], {size: 4});  
    tx = nrf.openPipe('tx', pipes[1], {autoAck: false}); 

var state = 1;

tessel.port['GPIO'].pwmFrequency(980);

rx.on('data', function(d) {

    var s = d.readUInt32BE(0);

    console.log("Got:", s);

    if(s == 0) s = 255;

    tessel.port['GPIO'].pwm[0].pwmDutyCycle((255-s)/255);

});

tx.on('error', function(e) {
    console.warn("Error sending reply.", e);
});

process.ref();