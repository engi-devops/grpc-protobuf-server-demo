const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Constants
const PROTO_DIR = path.resolve(__dirname, './protos');
const PROTO_OPTIONS = { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true };
// Load Protobuf Files
function loadProtos(protoDir, options) {
  return fs.readdirSync(protoDir).filter(file => file.endsWith('.proto')).map(file => grpc.loadPackageDefinition(protoLoader.loadSync(path.join(protoDir, file), options)));
}
const loadedProtos = loadProtos(PROTO_DIR, PROTO_OPTIONS);

// Middleware and Handlers
const { JwtAuthMiddleware } = require('./middlewares/verify.middleware');
const { gRPCTestfn, gRPCTestAnotherfn } = require('./handlers/handlers');

// Initialize and Start gRPC Server
function startServer(port) {
  const server = new grpc.Server();
  // Register services
  if (loadedProtos[0]?.greet?.Greeter?.service) {
    server.addService(loadedProtos[0].greet.Greeter.service, {
      gRPCTestfn: JwtAuthMiddleware(gRPCTestfn),
      gRPCTestAnotherfn: JwtAuthMiddleware(gRPCTestAnotherfn),
    });
  } else {
    console.error('gRPC service definition not found in loaded protos.');
    return;
  }

  // Start server
  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, boundPort) => {
      if (err) {
        console.error('Failed to start gRPC server:', err);
      } else {
        console.log(`gRPC-Protobuf-Server running on port -:++++${boundPort}`);
      }
    }
  );
}

function main() {
  const port = process.env.PORT || 3015;
  startServer(port);
}

main();