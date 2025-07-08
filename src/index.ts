import dotenv from 'dotenv';
import express from 'express';
import db, { client } from '../src/drizzle/db';
import { hotelRoute } from '../src/routes/hotelsroute';
import { roomRoute } from '../src/routes/roomsroute';
import { paymentRoute } from '../src/routes/paymentsroute';
import { ticketRoute } from '../src/routes/ticketsroute';
import { bookingRoute } from '../src/routes/bookingsroute';
import { authRoute } from '../src/routes/authroute';



dotenv.config();

const app = express();


// middleware
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
const  port = process.env.PORT


hotelRoute(app);
roomRoute(app);
paymentRoute(app);
ticketRoute(app);
bookingRoute(app);
authRoute(app);





app.listen(port, () => {
    client
    
  console.log(`Server is running on http://localhost:${port}`);
});