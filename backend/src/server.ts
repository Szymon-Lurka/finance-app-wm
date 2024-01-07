import express, {Application} from 'express';

const app = express();

app.get('/', (req, res) => {
    res.json({status: 'success', data: [1, 2, 3, 4, 5]});
})

app.listen(3001, () => {
    console.log('Listening on 3001...');
})
