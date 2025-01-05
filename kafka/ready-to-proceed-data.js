const { sendKafkaMessage } = require("./kafka-producer");

async function isProcessDataAnalyticsTestSuccess(event) {
  try {
    // Extract parameters with default values for missing data
    const msg = {
      id: event.id,
      name: event.name,
      age: event.age
    };

    await sendKafkaMessage('kafka_test', msg); // producer data kafka to clickhouse

    return true; // Indicate success
  } catch (error) {
    console.error('isProcessDataAnalyticsTestSuccess error -:', error);
    return false; // Indicate failure
  }
}

module.exports = {
  isProcessDataAnalyticsTestSuccess
};