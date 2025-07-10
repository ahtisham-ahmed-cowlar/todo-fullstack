import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  client.publish('todo/alert', 'FAUZ!', () => {
    console.log('Alert pushed with retain!');
    client.end();
  });
});
