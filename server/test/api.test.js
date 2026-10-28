// Run with MongoDB running:  npm test
// Uses a separate database (taskify_test) so your real tasks are never touched.
const assert = require('assert');
const mongoose = require('mongoose');
const app = require('../app');

const BASE_URI = process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/taskify_test';

let server, base;
const call = async (method, path, body) => {
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }
  return { status: res.status, data };
};

const tests = [];
const test = (name, fn) => tests.push([name, fn]);

test('health check', async () => {
  const r = await call('GET', '/api/health');
  assert.strictEqual(r.status, 200);
});

test('starts empty with zero stats', async () => {
  const list = await call('GET', '/api/tasks');
  assert.deepStrictEqual(list.data, []);
  const s = await call('GET', '/api/tasks/stats');
  assert.deepStrictEqual(s.data, { total: 0, pending: 0, completed: 0 });
});

let id1, id2;
test('create task (defaults to pending, trims title)', async () => {
  const r = await call('POST', '/api/tasks', { title: '  Complete MERN Stack Project  ', description: 'Build and deploy' });
  assert.strictEqual(r.status, 201);
  assert.strictEqual(r.data.title, 'Complete MERN Stack Project');
  assert.strictEqual(r.data.status, 'pending');
  assert.ok(r.data.createdAt);
  id1 = r.data._id;
  const r2 = await call('POST', '/api/tasks', { title: 'Learn Express.js Middleware' });
  assert.strictEqual(r2.status, 201);
  assert.strictEqual(r2.data.description, '');
  id2 = r2.data._id;
});

test('validation: missing / blank / too long title is rejected', async () => {
  assert.strictEqual((await call('POST', '/api/tasks', {})).status, 400);
  assert.strictEqual((await call('POST', '/api/tasks', { title: '   ' })).status, 400);
  assert.strictEqual((await call('POST', '/api/tasks', { title: 'x'.repeat(101) })).status, 400);
  assert.strictEqual((await call('POST', '/api/tasks', { title: 'ok', status: 'bogus' })).status, 400);
});

test('list returns newest first', async () => {
  const r = await call('GET', '/api/tasks');
  assert.strictEqual(r.data.length, 2);
  assert.strictEqual(r.data[0]._id, id2);
});

test('toggle completes then reopens a task', async () => {
  let r = await call('PATCH', `/api/tasks/${id1}/toggle`);
  assert.strictEqual(r.data.status, 'completed');
  r = await call('PATCH', `/api/tasks/${id1}/toggle`);
  assert.strictEqual(r.data.status, 'pending');
  r = await call('PATCH', `/api/tasks/${id1}/toggle`);
  assert.strictEqual(r.data.status, 'completed');
});

test('filter by status and stats', async () => {
  const pending = await call('GET', '/api/tasks?status=pending');
  const done = await call('GET', '/api/tasks?status=completed');
  const all = await call('GET', '/api/tasks?status=all');
  assert.deepStrictEqual(pending.data.map((t) => t._id), [id2]);
  assert.deepStrictEqual(done.data.map((t) => t._id), [id1]);
  assert.strictEqual(all.data.length, 2);
  assert.strictEqual((await call('GET', '/api/tasks?status=nope')).status, 400);
  const s = await call('GET', '/api/tasks/stats');
  assert.deepStrictEqual(s.data, { total: 2, pending: 1, completed: 1 });
});

test('update task', async () => {
  const r = await call('PUT', `/api/tasks/${id2}`, { title: 'Learn Express Middleware', description: 'Understand it', status: 'completed' });
  assert.strictEqual(r.status, 200);
  assert.strictEqual(r.data.title, 'Learn Express Middleware');
  assert.strictEqual(r.data.status, 'completed');
  const bad = await call('PUT', `/api/tasks/${id2}`, { title: '' });
  assert.strictEqual(bad.status, 400);
});

test('bad ids and unknown ids', async () => {
  assert.strictEqual((await call('PUT', '/api/tasks/not-an-id', { title: 'x' })).status, 400);
  assert.strictEqual((await call('DELETE', '/api/tasks/not-an-id')).status, 400);
  const ghost = new mongoose.Types.ObjectId().toString();
  assert.strictEqual((await call('PUT', `/api/tasks/${ghost}`, { title: 'x' })).status, 404);
  assert.strictEqual((await call('PATCH', `/api/tasks/${ghost}/toggle`)).status, 404);
  assert.strictEqual((await call('DELETE', `/api/tasks/${ghost}`)).status, 404);
  assert.strictEqual((await call('GET', '/api/nothing')).status, 404);
});

test('delete task', async () => {
  const r = await call('DELETE', `/api/tasks/${id1}`);
  assert.strictEqual(r.status, 200);
  const s = await call('GET', '/api/tasks/stats');
  assert.deepStrictEqual(s.data, { total: 1, pending: 0, completed: 1 });
});

(async () => {
  try {
    await mongoose.connect(BASE_URI, { serverSelectionTimeoutMS: 5000 });
  } catch (e) {
    console.error('Cannot reach MongoDB at', BASE_URI, '-', e.message);
    process.exit(1);
  }
  await mongoose.connection.dropDatabase();
  server = app.listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
  let failed = 0;
  for (const [name, fn] of tests) {
    try { await fn(); console.log('  PASS', name); }
    catch (e) { failed++; console.log('  FAIL', name, '\n      ', e.message); }
  }
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  server.close();
  console.log(failed ? `\n${failed} test(s) failed` : `\nAll ${tests.length} tests passed`);
  process.exit(failed ? 1 : 0);
})();
