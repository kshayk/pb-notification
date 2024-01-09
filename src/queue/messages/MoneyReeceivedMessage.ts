import * as amqp from 'amqplib';
import {queueConnect} from "../rabbitmq";
import {Imessage} from "./Imessage";
import {sendReceivedNotification} from "../../notification/notificationManager";
import {MoneyReceivedMessageType} from "moneyReceivedMessageType";

export class MoneyReceivedMessage implements Imessage {
    consumeMessage = async (): Promise<void> => {
        const queueName = 'moneyReceivedQueue';

        const channel = await queueConnect(queueName);

        console.log('moneyReceivedQueue queue connected');

        do {
            await channel.consume(queueName, (message) => {
                if (!message) {
                    return;
                }

                const parsedMessage: MoneyReceivedMessageType = JSON.parse(message.content.toString());

                console.log('money received message received', parsedMessage);

                // TODO: If parsedMessage is not of type MoneyReceivedMessageType, make sure to increase the retry count and log the error

                sendReceivedNotification(parsedMessage).catch((error) => {
                    console.error('Error sending notification:', error);
                    // TODO: Increase retry count
                });

                channel.ack(message);
            }, {noAck: false});
        } while (true);
    }
}