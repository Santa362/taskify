// Fills the database with demo tasks:  npm run seed
// WARNING: this deletes all existing tasks first.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Task = require('./models/Task');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskify';

const demo = [
  ['Complete MERN Stack Project', 'Build and deploy the task management application.', 'pending'],
  ['Learn Express.js Middleware', 'Understand and implement middleware in Express.', 'pending'],
  ['Setup MongoDB Database', 'Install MongoDB and connect with Node.js.', 'completed'],
  ['Design React Frontend', 'Create responsive UI using React and CSS.', 'completed'],
  ['Write REST API endpoints', 'Create, read, update and delete routes for tasks.', 'completed'],
  ['Test APIs with Postman', 'Check every endpoint and its error responses.', 'completed'],
  ['Connect React with Axios', 'Fetch and update tasks from the Express API.', 'completed'],
  ['Add task filtering', 'Show pending and completed tasks separately.', 'pending'],
  ['Add form validation', 'Validate input on both the client and the server.', 'pending'],
  ['Push code to GitHub', 'Commit the project and write a README.', 'pending'],
  ['Prepare internship presentation', 'Fill the review template and rehearse the demo.', 'pending'],
  ['Add JWT authentication', 'Future enhancement: login and role-based access.', 'pending'],
];

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    await Task.deleteMany({});
    // Insert one by one, oldest first, so the list order looks natural.
    for (const [title, description, status] of demo.slice().reverse()) {
      await Task.create({ title, description, status });
    }
    const pending = demo.filter((d) => d[2] === 'pending').length;
    console.log(`Seeded ${demo.length} tasks (${pending} pending, ${demo.length - pending} completed).`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
