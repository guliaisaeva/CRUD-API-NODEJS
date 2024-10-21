import http from 'http';
import { parse } from 'url';
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from './users';

const server = http.createServer((req, res) => {
    const { method, url } = req;
    const parsedUrl = parse(url || '', true);
    const path = parsedUrl.pathname || '';

    res.setHeader('Content-Type', 'application/json');

    if (method === 'GET' && path === '/api/users') {
        const users = getAllUsers();
        res.writeHead(200);
        res.end(JSON.stringify(users));
    } else if (method === 'GET' && path.startsWith('/api/users/')) {
        const userId = path.split('/')[3];
        if (!userId || userId.length !== 36) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid userId' }));
        } else {
            const user = getUserById(userId);
            if (user) {
                res.writeHead(200);
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        }
    } else if (method === 'POST' && path === '/api/users') {
        let body: string = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { username, age, hobbies } = JSON.parse(body);
            if (username && typeof age === 'number' && Array.isArray(hobbies)) {
                const newUser = createUser(username, age, hobbies);
                res.writeHead(201);
                res.end(JSON.stringify(newUser));
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Required fields missing' }));
            }
        });
    } else if (method === 'PUT' && path.startsWith('/api/users/')) {
        const userId = path.split('/')[3];
        if (!userId || userId.length !== 36) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid userId' }));
        } else {
            let body: string = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const updates = JSON.parse(body);
                const updatedUser = updateUser(userId, updates);
                if (updatedUser) {
                    res.writeHead(200);
                    res.end(JSON.stringify(updatedUser));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User not found' }));
                }
            });
        }
    } else if (method === 'DELETE' && path.startsWith('/api/users/')) {
        const userId = path.split('/')[3];
        if (!userId || userId.length !== 36) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Invalid userId' }));
        } else {
            const deleted = deleteUser(userId);
            if (deleted) {
                res.writeHead(204);
                res.end();
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
            }
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not found' }));
    }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
