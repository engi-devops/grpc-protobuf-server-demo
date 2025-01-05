const { Kafka, Partitioners } = require('kafkajs');
require('dotenv').config();

// Kafka configuration
const kafka = new Kafka({
  clientId: 'test-technologies-app',
  brokers: [`${process.env.IS_KAFKA_BROKER}`], // Replace with your Kafka broker(s)
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

/**
 * Sends a message to a Kafka topic.
 * @param {string} topic - The Kafka topic name.
 * @param {string|object} message - The message to send. If an object, it will be stringified.
 */
async function sendKafkaMessage(topic, message) {
  try {
    // Connect the producer
    await producer.connect();

    // Send the message
    await producer.send({
      topic,
      messages: [
        {
          value: typeof message === 'string' ? message : JSON.stringify(message),
        },
      ],
    });

    console.log(`Message sent to topic "${topic}":`, message);
  } catch (error) {
    console.error('Error sending Kafka message:', error);
    throw error; // Optionally rethrow the error
  } finally {
    // Disconnect the producer
    await producer.disconnect();
  }
}

module.exports = {
  sendKafkaMessage
};