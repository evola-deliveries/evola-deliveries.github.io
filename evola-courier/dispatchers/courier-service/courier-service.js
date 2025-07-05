import express from 'express';
import contractRoute from './contract/contract.js';
import corporationRoute from './corporation/corporation.js';
import memberRoute from './member/member.js';
import sendEveMailRoute from './send-eve-mail/send-eve-mail.js'

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({ message: 'ok' });
});

app.use('/contract', contractRoute);
app.use('/corporation', corporationRoute);
app.use('/member', memberRoute);
app.use('/send-eve-mail', sendEveMailRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`[Dispatcher API] Listening on port ${port}`);
});
