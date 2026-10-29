import { test } from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../../server/db';

test('auth registration works with whitespace trimming and starts with onboardingCompleted: false and 0 records', () => {
  const email = `user_${Date.now()}@test.ph`;
  const password = 'securePassword123';
  const nickname = 'EcoWarrior';

  const user = db.createUser({ email: `  ${email}  `, password, nickname: `  ${nickname}  ` });
  assert.ok(user.id, 'User must have an ID');
  assert.equal(user.email, email.toLowerCase(), 'Email should be normalized to lowercase and trimmed');
  assert.equal(user.nickname, nickname, 'Nickname should be trimmed');
  assert.equal(user.onboardingCompleted, false, 'New user must start with onboardingCompleted: false');

  // Verify new user starts with 0 records and 0 goals
  const initialRecords = db.getRecordsByUser(user.id);
  assert.equal(initialRecords.length, 0, 'New user must have 0 records');
  const initialGoals = db.getGoals(user.id);
  assert.equal(initialGoals.length, 0, 'New user must have 0 goals');

  // Verify password matches
  const verified = db.verifyPassword(user, password);
  assert.equal(verified, true, 'Password verification should succeed');

  // Verify session token can be created and verified
  const token = db.createSessionToken(user.id);
  assert.ok(token, 'Session token should be generated');
  const session = db.verifySessionToken(token);
  assert.equal(session?.userId, user.id, 'Session should decode to user id');

  // Test completeUserOnboarding
  const { user: updatedUser, goal } = db.completeUserOnboarding(
    user.id,
    'imperial_gallons',
    'SuperSaver',
    {
      title: 'Family Conservation Ceiling',
      targetLiters: 150,
      period: 'daily',
      category: 'all',
    }
  );

  assert.equal(updatedUser.onboardingCompleted, true, 'Onboarding must now be completed');
  assert.equal(updatedUser.preferredUnit, 'imperial_gallons', 'Preferred unit must be saved');
  assert.equal(updatedUser.nickname, 'SuperSaver', 'Nickname must be updated');
  assert.ok(goal, 'Goal must be created');
  assert.equal(goal?.targetLiters, 150, 'Goal target liters must match');
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

test('strict user data isolation: User A records are invisible and protected from User B', () => {
  const userA = db.createUser({ email: `usera_${Date.now()}@test.ph`, password: 'password123', nickname: 'UserA' });
  const userB = db.createUser({ email: `userb_${Date.now()}@test.ph`, password: 'password123', nickname: 'UserB' });

  // Add record for User A
  const recA = db.createRecord(userA.id, {
    activityName: 'Private Shower',
    category: 'bathing_showering',
    quantity: 45,
    quantityLiters: 45,
    unit: 'liters',
    date: '2026-10-29',
    time: '08:00',
    isEstimated: false,
  });

  // Verify User A sees 1 record, User B sees 0 records
  assert.equal(db.getRecordsByUser(userA.id).length, 1);
  assert.equal(db.getRecordsByUser(userB.id).length, 0);

  // User B cannot delete User A's record
  const deletedByB = db.deleteRecord(userB.id, recA.id);
  assert.equal(deletedByB, false, 'User B must not be able to delete User A record');
  assert.equal(db.getRecordsByUser(userA.id).length, 1, 'User A record must remain intact');

  // User A can delete their own record
  const deletedByA = db.deleteRecord(userA.id, recA.id);
  assert.equal(deletedByA, true, 'User A should be able to delete their own record');
  assert.equal(db.getRecordsByUser(userA.id).length, 0);
});
