import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.json({status: 'success', data: [1, 2, 3, 4, 5, 'tessssst']});
})

app.listen(3001, () => {
    console.log('Listening on 3001... :)');
})
