process.env.NODE_ENV = 'test';
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { app, server } = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();
	process.env.MONGO_URI = mongoUri;
	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

afterAll(async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
	server.close();
});

describe('Auth API', () => {
	beforeEach(async () => {
		await User.deleteMany({});
	});

	it('should allow a new user to sign up', async () => {
		const newUser = {
			email: 'testuser@gmail.com',
			password: 'Password123!',
		};

		const response = await request(app).post('/api/auth/signup').send(newUser);

		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('token');

		const savedUser = await User.findOne({ email: 'testuser@gmail.com' });
		expect(savedUser).not.toBeNull();
	});

	it('should reject signup with an existing email', async () => {
		const testUser = {
			email: 'duplicate@gmail.com',
			password: 'Password123!',
		};

		await request(app).post('/api/auth/signup').send(testUser).expect(201);

		const response = await request(app)
			.post('/api/auth/signup')
			.send(testUser)
			.expect(400);

		expect(response.body.message).toBe('User already exists');

		const users = await User.find({ email: testUser.email });
		expect(users.length).toBe(1);
	});

	it('should reject signup when email is missing', async () => {
		const missingEmailUser = {
			email: "",
			password: 'Password123!',
		};

		const response = await request(app)
			.post('/api/auth/signup')
			.send(missingEmailUser)
			.expect(400);

		expect(response.body.message).toBe('Please enter all fields');

		const users = await User.find({});
		expect(users.length).toBe(0);
	});

	it('should reject signup when password is missing', async () => {
		const missingPasswordUser = {
			email: 'user@example.com',
			password: "",
		};

		const response = await request(app)
			.post('/api/auth/signup')
			.send(missingPasswordUser)
			.expect(400);

		expect(response.body.message).toBe('Please enter all fields');

		const users = await User.find({});
		expect(users.length).toBe(0);
	});
});