import * as mongoose from 'mongoose';

const connectToDB = () => {
    const MONGO_URI = process.env.mongoURI || '';
    mongoose.connect(MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB!')
        }).catch((error) => {
        console.error('Failed to connect to MongoDB: ', error);
    })
}

export default connectToDB;
