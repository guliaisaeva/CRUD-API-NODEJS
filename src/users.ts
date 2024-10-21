import { v4 as uuidv4 } from 'uuid';
import { User } from './models/user';

let users: User[] = [];

const findUserIndex = (userId: string): number => {
  return users.findIndex((user) => user.id === userId);
};

export const getAllUsers = (): User[] => users;

export const getUserById = (userId: string): User | null => {
  const user = users.find((user) => user.id === userId);
  return user || null;
};

export const createUser = (
  username: string,
  age: number,
  hobbies: string[],
): User => {
  if (typeof username !== 'string' || username.trim() === '') {
    throw new Error('Username is required and must be a non-empty string.');
  }
  if (typeof age !== 'number' || age < 0) {
    throw new Error('Age is required and must be a non-negative number.');
  }
  if (!Array.isArray(hobbies)) {
    throw new Error('Hobbies must be an array.');
  }

  const newUser: User = {
    id: uuidv4(),
    username,
    age,
    hobbies: hobbies.length ? hobbies : [],
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = (
  userId: string,
  updates: Partial<User>,
): User | null => {
  const index = findUserIndex(userId);
  if (index !== -1) {
    const userToUpdate = users[index];

    if (
      updates.username &&
      (typeof updates.username !== 'string' || updates.username.trim() === '')
    ) {
      throw new Error('Username must be a non-empty string.');
    }
    if (
      updates.age !== undefined &&
      (typeof updates.age !== 'number' || updates.age < 0)
    ) {
      throw new Error('Age must be a non-negative number.');
    }
    if (updates.hobbies && !Array.isArray(updates.hobbies)) {
      throw new Error('Hobbies must be an array.');
    }

    users[index] = { ...userToUpdate, ...updates };
    return users[index];
  }
  return null;
};

export const deleteUser = (userId: string): boolean => {
  const index = findUserIndex(userId);
  if (index !== -1) {
    users.splice(index, 1);
    return true;
  }
  return false;
};
