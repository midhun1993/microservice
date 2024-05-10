const express = require('express');
const amqplib = require('amqplib');
const app = express();

// creat a rabbit mq conenction 
const RABBIT_MQ_HOST =  'amqp://ms-rabitmq-1:5672';
const queue = 'order';

const RabbitMq= {
    _ch: null,
    async init(){
       
        const conn = await amqplib.connect(RABBIT_MQ_HOST);
        const ch1 = await conn.createChannel();
        this._ch = ch1;  
        
    }, 
    async getChannel(){
        if(!this._ch) {
            await this.init()
        }
        return this._ch;
    }
}



app.get('', async(req, res, next)=> {
    const { id, email} = req.query;
    const ch1 = await RabbitMq.getChannel();
    await ch1.assertQueue(queue);
    ch1.sendToQueue(queue, Buffer.from(`Notify order: ${id}, email: ${email}`));
    console.log(`Notify order: ${id}, email: ${email}`);
    res.json({
        status: true,
        msg: "order created successfully"
    });
});

app.listen(3000);
