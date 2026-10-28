require('dotenv').config({ quiet: true });
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskify';

connectDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Taskify API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    console.error('Is MongoDB running? Try: sudo systemctl start mongod');
    process.exit(1);
  });
