import mongoose from 'mongoose';

const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: 'e-commerce-latest',
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export { connectDB };
