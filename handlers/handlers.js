// handlers.js
const {
  isProcessDataAnalyticsTestSuccess
} = require('../kafka/ready-to-proceed-data');


/**
 * Handles the gRPC test function.
 * @param {Object} call - The gRPC call object containing the request.
 * @param {Function} callback - The gRPC callback function.
 */
const gRPCTestfn = async (call, callback) => {
  const { id, name, age, user } = call.request;
  console.info('Received request for gRPCTestfn:', { id, name, age, user });
  await isProcessDataAnalyticsTestSuccess({ id, name, age });
  const response = {
    id: `updated@${id}`,
    message: `Hello ${name}!`,
    age: age + 1,
  };
  // Log the response before sending
  console.info('Sending response for gRPCTestfn:', response);
  callback(null, response);
};

/**
 * Handles the gRPC another test function.
 * @param {Object} call - The gRPC call object containing the request.
 * @param {Function} callback - The gRPC callback function.
 */
const gRPCTestAnotherfn = (call, callback) => {
  const { id, name } = call.request;
  console.info('Received request for gRPCTestAnotherfn:', { id, name });
  const response = {
    id: `updated@${id}`,
    message: `Goodbye ${name}!`,
  };
  // Log the response before sending
  console.info('Sending response for gRPCTestAnotherfn:', response);
  callback(null, response);
};

// Exporting handlers as named exports for flexibility and better modularity
module.exports = {
  gRPCTestfn,
  gRPCTestAnotherfn,
};