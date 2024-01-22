import mongoose, { Document, Schema, CallbackError } from 'mongoose';
import Ticket, { ITicket } from './ticket';

export interface IAnswered extends Document {
    ticket      : ITicket['_id'];
    ticketNumber: string;
    message     : string;
    status      : 'Open' | 'Answered' | 'Closed';
    priority    : 'High' | 'Medium' | 'Low';
}

const answeredSchema: Schema = new Schema({
    ticket      : { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    ticketNumber: { type: String }, 
    message     : { type: String, required: true },
    status      : { type: String, enum: ['Open', 'Answered', 'Closed'], required: true, default: "Answered" },
    priority    : { type: String, enum: ['High', 'Medium', 'Low'] },
});


answeredSchema.pre<IAnswered>('save', async function(next: (err?: CallbackError) => void) {
    try {
        if (this.isNew) {
            const ticket = await Ticket.findById(this.ticket);
            if (!ticket) {
                throw new Error('Ticket not found');
            }
            this.priority = ticket.priority;
            this.ticketNumber = String(ticket.ticketNumber);

            ticket.status = 'Answered';
            await ticket.save();
        }

        if (this.status === 'Closed') {
            const ticket = await Ticket.findById(this.ticket);
            if (ticket) {
                ticket.status = 'Closed';
                await ticket.save();
            }
        }

        next();
    } catch (error) {
        console.error(error);
        next(error as CallbackError);
    }
});

const Answered = mongoose.model<IAnswered>('Answered', answeredSchema);
export default Answered;
