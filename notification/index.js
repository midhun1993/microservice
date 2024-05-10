const amqplib = require('amqplib');

(async () => {
  const queue = 'order';
  const conn = await amqplib.connect('amqp://ms-rabitmq-1:5672');

  const ch1 = await conn.createChannel();
  await ch1.assertQueue(queue);

  // Listener
  ch1.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('Received:', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
})();