import { v4 as uuidv4 } from 'uuid';
import { User } from './models/user';

let users: User[] = [];

const findUserIndex = (userId: string): number => {
    return users.findIndex(user => user.id === userId);
};

export const getAllUsers = (): User[] => users;

export const getUserById = (userId: string): User | null => {
    const user = users.find(user => user.id === userId);
    return user || null;
};

export const createUser = (username: string, age: number, hobbies: string[]): User => {
    const newUser: User = {
        id: uuidv4(),
        username,
        age,
        hobbies
    };
    users.push(newUser);
    return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
    const index = findUserIndex(userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
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