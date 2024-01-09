import * as amqp from 'amqplib';
import {queueConnect} from "../rabbitmq";
import {Imessage} from "./Imessage";
import {MoneySentMessageType} from "moneySentMessageType";
import {sendSentNotification} from "../../notification/notificationManager";

export class MoneySentMessage implements Imessage {
    consumeMessage = async (): Promise<void> => {
        const queueName = 'moneySentQueue';

        const channel = await queueConnect(queueName);

        console.log('moneySentQueue queue connected');

        do {
            await channel.consume(queueName, (message) => {
                if (!message) {
                    return;
                }

                const parsedMessage: MoneySentMessageType = JSON.parse(message.content.toString());

                console.log('money sent message received', parsedMessage);

                // TODO: If parsedMessage is not of type MoneySentMessageType, make sure to increase the retry count and log the error

                sendSentNotification(parsedMessage).catch((error) => {
                    console.error('Error sending notification:', error);
                    // TODO: Increase retry count
                });

                channel.ack(message);
            }, {noAck: false});
        } while (true);
    }
}