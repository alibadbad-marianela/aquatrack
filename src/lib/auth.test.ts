import { test } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../../server/db';

test('auth registration works with whitespace trimming and creates user', () => {
  const email = `user_${Date.now()}@test.ph`;
  const password = 'securePassword123';
  const nickname = 'EcoWarrior';

  const user = db.createUser({ email: `  ${email}  `, password, nickname: `  ${nickname}  ` });
  assert.ok(user.id, 'User must have an ID');
  assert.equal(user.email, email.toLowerCase(), 'Email should be normalized to lowercase and trimmed');
  assert.equal(user.nickname, nickname, 'Nickname should be trimmed');
  assert.equal(user.onboardingCompleted, true, 'onboardingCompleted should be true');

  // Verify password matches
  const verified = db.verifyPassword(user, password);
  assert.equal(verified, true, 'Password verification should succeed');

  // Verify session token can be created and verified
  const token = db.createSessionToken(user.id);
  assert.ok(token, 'Session token should be generated');
  const session = db.verifySessionToken(token);
  assert.equal(session?.userId, user.id, 'Session should decode to user id');
});

test('auth registration prevents duplicate email with descriptive error', () => {
  const email = `duplicate_${Date.now()}@test.ph`;
  db.createUser({ email, password: 'password123', nickname: 'FirstUser' });

  assert.throws(
    () => {
      db.createUser({ email, password: 'password456', nickname: 'SecondUser' });
    },
    (err: any) => {
      return err.message.includes('already exists');
    }
  );
});

test('auth login verification distinguishes wrong password from valid password', () => {
  const email = `login_${Date.now()}@test.ph`;
  const password = 'mySecretPassword99';
  const user = db.createUser({ email, password, nickname: 'LoginTester' });

  assert.equal(db.verifyPassword(user, password), true, 'Correct password must succeed');
  assert.equal(db.verifyPassword(user, 'wrongPassword'), false, 'Wrong password must fail');
});
