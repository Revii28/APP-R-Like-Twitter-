const Redis = require('ioredis').Redis;
const dotenv = require('dotenv');

dotenv.config();

const redis = new Redis({
  port: 10086,
  host: "redis-10086.c292.ap-southeast-1-1.ec2.redns.redis-cloud.com",
  username: "default",
  password: process.env.PASSWORD_REDIS,
  db: 0,
});

module.exports = { redis };

// module.exports = {
//   apps: [
//     {
//       name: "app",
//       script: "./App",
//       env: {
//         NODE_ENV: "production",
//         PORT: 80,
//         URI_MONGODB:
//           "mongodb+srv://revirifaldi:26KWZf7AaTYjOFFw@rmt-050-revi.t2qt3qp.mongodb.net/?retryWrites=true&w=majority&appName=RMT-050-Revi",
//         PASSWORD_REDIS: "c7M1zkV56pQxgD3Ycr7k0EMVGHoXZrUN",
//         PASSWORD_JWT: "aplikasimobilerevi",
//       },
//     },
//   ],
// };
