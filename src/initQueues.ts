import {MoneyReceivedMessage} from "./queue/messages/MoneyReeceivedMessage";
import {MoneySentMessage} from "./queue/messages/moneySentMessage";

const moneyReceivedQueue = new MoneyReceivedMessage();
const moneySentQueue = new MoneySentMessage();

moneyReceivedQueue.consumeMessage().catch((error) => {
    console.error('Error consuming message:', error);
});

moneySentQueue.consumeMessage().catch((error) => {
    console.error('Error consuming message:', error);
});