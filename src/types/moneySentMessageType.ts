export type MoneySentMessageType = {
    transferId: string;
    amount: number;
    receiverId: string;
    senderId: string;
    note: string;
}