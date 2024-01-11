interface MongoError {
    message: string;
    name: string;
    code: number;
    keyPattern: {[key:string]: number};
}

export {
    MongoError
}