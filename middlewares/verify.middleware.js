// JwtAuthMiddleware.js
const jwt = require('jsonwebtoken');
const grpc = require('@grpc/grpc-js');
require('dotenv').config();

function JwtAuthMiddleware(handler) {
  return function asyncHandler(call, callback) {
    const authHeader = call?.metadata?.get('authorization')?.[0] || null;
    const errorResponse = { success: false, msg: 'Unauthorized Token Expired.' };
    if (!authHeader) {
      callback({ code: grpc.status.UNAUTHENTICATED, details: JSON.stringify(errorResponse) });
      return;
    }
    const token = authHeader.split('Bearer ')[1];
        try {
            jwt.verify(token, process.env.IS_APP_SECRET_KEY, async (Error, decoded) => {
                if (Error) {
                    callback({ code: grpc.status.UNAUTHENTICATED, details: JSON.stringify(errorResponse) });
                    return;
                } else {
                    call.request.user = decoded;
                }
            });
        } catch (err) {
            callback({ code: grpc.status.UNAUTHENTICATED, details: JSON.stringify(errorResponse) });
            return;
        }
    handler(call, callback);
  };
}

module.exports = {
    JwtAuthMiddleware
}