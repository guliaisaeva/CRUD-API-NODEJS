import http, { IncomingMessage, ServerResponse } from 'http';
import dotenv from 'dotenv';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from './users';

dotenv.config();

const PORT = process.env.PORT || 4000;

const sendResponse = (res: ServerResponse, statusCode: number, data: any) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const parseRequestBody = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;

  if (url === '/api/users' && method === 'GET') {
    sendResponse(res, 200, getAllUsers());
  } else if (url && url.startsWith('/api/users/') && method === 'GET') {
    const userId = url.split('/')[3];
    const user = getUserById(userId);

    if (!user) {
      sendResponse(res, 404, { message: 'User not found' });
    } else {
      sendResponse(res, 200, user);
    }
  } else if (url === '/api/users' && method === 'POST') {
    try {
      const newUser = await parseRequestBody(req);
      if (
        !newUser.username ||
        typeof newUser.age !== 'number' ||
        !Array.isArray(newUser.hobbies)
      ) {
        sendResponse(res, 400, { message: 'Invalid user data' });
      } else {
        const createdUser = createUser(
          newUser.username,
          newUser.age,
          newUser.hobbies,
        );
        sendResponse(res, 201, createdUser);
      }
    } catch (error) {
      sendResponse(res, 400, { message: 'Invalid JSON format' });
    }
  } else if (url && url.startsWith('/api/users/') && method === 'PUT') {
    const userId = url.split('/')[3];
    try {
      const updates = await parseRequestBody(req);
      const updatedUser = updateUser(userId, updates);

      if (!updatedUser) {
        sendResponse(res, 404, { message: 'User not found' });
      } else {
        sendResponse(res, 200, updatedUser);
      }
    } catch (error) {
      sendResponse(res, 400, { message: 'Invalid JSON format' });
    }
  } else if (url && url.startsWith('/api/users/') && method === 'DELETE') {
    const userId = url.split('/')[3];
    const isDeleted = deleteUser(userId);

    if (isDeleted) {
      res.writeHead(204);
      res.end();
    } else {
      sendResponse(res, 404, { message: 'User not found' });
    }
  } else {
    sendResponse(res, 404, { message: 'Route not found' });
  }
};

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
