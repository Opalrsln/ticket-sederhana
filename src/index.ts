import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { sign, jwt } from 'hono/jwt';
import usersModel from './models/usersModel';
import Ticket from './models/ticket';
import Answered from './models/answered';

const app = new Hono()

const dbUrl = 'mongodb://0.0.0.0:27017/ticket_sederhana'

mongoose.connect(dbUrl)
const conn = mongoose.connection

  conn.on('error', () => {
    console.log('Connection Failed')
    process.exit(1)
  }).once('open', () => {
    console.log('Database Connected')
  })

const SECRET_KEY = "KWNjwniav418";

app.use(
  '/auth/*'
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})

app.post('/register', async (c) => {
  const { username, email, password, address, phonenumber } = await c.req.json();

  const existingUser = await usersModel.findOne({ email });

  if (existingUser) {
    return c.json({ message: 'Email already registered.' });
  }

  const user = new usersModel({
    username,
    email,
    password,
    address,
    phonenumber
  });

  user.password = await bcrypt.hash(password, 10);
  await user.save();

  return c.json({ message: 'User successfully registered.' });
});

app.post('/login', async (c) => { 
  const { email , password } = await c.req.json()

  const user = await usersModel.findOne({ email: email })

  if(!user) {
    return c.json({message: "User not found"}, {status: 404})
  }

  if(!user.password) {
    return c.json({message: "Password not set"}, {status: 404})
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if(isPasswordValid) {
    const payload = {
      id: user.id.toString(),
      name: user.username
    }

    const secret = SECRET_KEY!

    const token = await sign(payload, secret)

    return c.json({
      data: payload,
      token: token
    })
  } else {
      return c.json({message: "Wrong password"}, {status: 403})
  }
})

app.use('/tickets/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: SECRET_KEY!
  })

  return jwtMiddleware(c, next)
})

app.use('/users/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: SECRET_KEY!
  })

  return jwtMiddleware(c, next)
})

app.get('/users', async (c) => {
  // Dapatkan semua pengguna dari database
  const users = await usersModel.find({});

  // Hapus kata sandi dari data yang akan dikirim ke klien
  const usersWithoutPassword = users.map(user => {
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  });

  // Kirim data pengguna ke klien
  return c.json(usersWithoutPassword);
});

//Untuk menampilkan data tickets
app.get('/tickets', async (c) => {
  const page = Number(c.req.query('page')) || 1
  const size = Number(c.req.query('size')) || 10
  const skip : number = (page - 1) * size
  const tickets = await Ticket.find().skip(skip).limit(size);

  // Ubah urutan field dalam respons
  const formattedTickets = tickets.map(ticket => ({
    _id         : ticket._id,
    ticketNumber: ticket.ticketNumber,
    subject     : ticket.subject,
    message     : ticket.message,
    status      : ticket.status,
    priority    : ticket.priority
  }));

  return c.json(formattedTickets);
});

app.post('/tickets' , async (c) => {
  const response = await c.req.json();
  const { subject, message, priority } = response;

  // Validasi input
  if (!subject || !message || !priority) {
    return c.json({ message: 'Subject, message, and priority are required.' });
  }

  try {
    const savedTicket = await Ticket.create({
      subject,
      message,
      priority
    });
    return c.json(savedTicket);
  } catch (err) {
    console.log(err); // Log error
    return c.json({ message: 'An error occurred while saving the ticket.' });
  }
});

app.put('/tickets/:id', async (c) => {
  const id = c.req.param('id');

  if (!id) {
    return c.json({ message: 'ID is required.' });
  }

  try {
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status: 'Closed' },
      { new: true }
    );

    if (!updatedTicket) {
      return c.json({ message: 'Ticket not found.' });
    }

    return c.json(updatedTicket);
  } catch (err) {
    console.log(err); // Log error
    return c.json({ message: 'An error occurred while updating the ticket.' });
  }
});

app.delete('/tickets/:id', async (c) => {
  const id = c.req.param('id');

  // Validasi input
  if (!id) {
    return c.json({ message: 'ID is required.' });
  }

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return c.json({ message: 'Ticket not found.' });
    }

    // Hapus tiket dan semua jawaban terkait
    await ticket.deleteOne();
    return c.json({ message: 'Ticket and related answers have been deleted.' });
  } catch (err) {
    console.log(err); // Log error
    return c.json({ message: 'An error occurred while deleting the ticket.' });
  }
});

app.get('tickets/answered', async (c) => {
  const page = Number(c.req.query('page')) || 1
  const size = Number(c.req.query('size')) || 10
  const skip : number = (page - 1) * size
  const answered = await Answered.find().skip(skip).limit(size);

  // Format the response
  const formattedAnswered = answered.map(answer => ({
    _id         : answer._id,
    ticketNumber: answer.ticketNumber,
    message     : answer.message,
    status      : answer.status,
    priority    : answer.priority
  }));

  return c.json(formattedAnswered);
});

app.post('tickets/answered', async (c) => {
  const response = await c.req.json();
  const { ticket, message } = response;

  // Validasi input
  if (!ticket || !message) {
    return c.json({ message: 'Ticket and message are required.' });
  }

  try {
    const savedAnswered = await Answered.create({
      ticket,
      message
    });
    return c.json(savedAnswered);
  } catch (error) {
    console.error(error); // Cetak error ke konsol
    if (error instanceof Error) {
      return c.json({ message: error.message }); // Kirim pesan error sebagai respons
    } else {
      return c.json({ message: 'An unknown error occurred.' });
    }
  }  
});

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
