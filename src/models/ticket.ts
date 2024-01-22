import mongoose, { Document, Schema, CallbackError } from 'mongoose';
import Answered from './answered';

export interface ITicket extends Document {
    ticketNumber: string;
    subject     : string;
    message     : string;
    status      : 'Open' | 'Answered' | 'Closed';
    priority    : 'High' | 'Medium' | 'Low';
}

//Menentukan isi ticketSchema
const ticketSchema: Schema = new Schema({
    ticketNumber:   { type: String },
    subject     :   { type: String, required: true },
    message     :   { type: String, required: true },
    status      :   { type: String, enum: ['Open', 'Answered', 'Closed'], required: true, default: "Open" },
    priority    :   { type: String, enum: ['High', 'Medium', 'Low'], required: true }
});

ticketSchema.pre<ITicket>('save', async function(next: (err?: CallbackError) => void) {
    try {
        var doc     = this;
        var date    = new Date();
        var year    = date.getFullYear();
        var month   = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed, so +1 and pad with leading 0 if necessary
        var day     = ('0' + date.getDate()).slice(-2); // Pad with leading 0 if necessary

        doc.ticketNumber = "TN" + year + month + day; // This will set the ticketNumber as 'yyyymmdd'

    next();
    }
        catch (error) {next(error as CallbackError);
    }
});

// Di dalam file model Ticket.js
ticketSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    // Hapus semua dokumen 'Answered' yang merujuk ke tiket ini
    await Answered.deleteMany({ ticket: this._id });
    next();
});

const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema); // Pindahkan definisi model ke sini
export default Ticket;
