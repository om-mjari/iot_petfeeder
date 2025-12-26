import mqtt from "mqtt";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MQTT Configuration
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || "mqtt://broker.hivemq.com";
const MQTT_PORT = process.env.MQTT_PORT || 1883;
const MQTT_TOPIC_COMMAND = process.env.MQTT_TOPIC || "petfeeder/servo";
const MQTT_TOPIC_RESPONSE = "petfeeder/servo/response";

// Initialize MQTT client
let mqttClient;

// Connection status
let isConnected = false;

// Initialize MQTT connection
export const initializeMQTT = () => {
  console.log(`🔄 Initializing MQTT connection to ${MQTT_BROKER_URL}:${MQTT_PORT}`);
  
  mqttClient = mqtt.connect(MQTT_BROKER_URL, {
    port: MQTT_PORT,
    reconnectPeriod: 5000, // Reconnect every 5 seconds
    connectTimeout: 10000, // 10 second timeout
  });

  mqttClient.on("connect", () => {
    console.log("✅ MQTT Connected to broker:", MQTT_BROKER_URL);
    isConnected = true;
    
    // Subscribe to response topic
    mqttClient.subscribe(MQTT_TOPIC_RESPONSE, (err) => {
      if (err) {
        console.error("❌ Failed to subscribe to response topic:", err);
      } else {
        console.log("✅ Subscribed to response topic:", MQTT_TOPIC_RESPONSE);
      }
    });
  });

  mqttClient.on("error", (error) => {
    console.error("❌ MQTT Connection Error:", error.message);
    isConnected = false;
  });

  mqttClient.on("close", () => {
    console.log("⚠️ MQTT Connection Closed");
    isConnected = false;
  });

  mqttClient.on("reconnect", () => {
    console.log("🔄 MQTT Reconnecting...");
  });

  mqttClient.on("offline", () => {
    console.log("⚠️ MQTT Offline");
    isConnected = false;
  });

  mqttClient.on("message", (topic, message) => {
    if (topic === MQTT_TOPIC_RESPONSE) {
      try {
        const response = JSON.parse(message.toString());
        console.log("📥 MQTT Response Received:", response);
        
        // Handle device responses here if needed
        // For example, update device status in database
      } catch (error) {
        console.error("❌ Error parsing MQTT response:", error);
      }
    }
  });

  return mqttClient;
};

// Publish servo command
export const publishServoCommand = (command) => {
  return new Promise((resolve, reject) => {
    if (!isConnected || !mqttClient) {
      console.warn("⚠️ MQTT not connected. Command not sent. This is normal if the device is offline.");
      return resolve(false);
    }

    try {
      // Add timestamp to command
      const commandWithTimestamp = {
        ...command,
        timestamp: new Date().toISOString(),
      };

      const message = JSON.stringify(commandWithTimestamp);
      
      mqttClient.publish(MQTT_TOPIC_COMMAND, message, { qos: 1 }, (error) => {
        if (error) {
          console.error("❌ Failed to publish MQTT command:", error);
          resolve(false);
        } else {
          console.log("📤 MQTT Command Sent:", commandWithTimestamp);
          resolve(true);
        }
      });
    } catch (error) {
      console.error("❌ Error publishing MQTT command:", error);
      resolve(false);
    }
  });
};

// Get MQTT connection status
export const getMQTTStatus = () => {
  return {
    connected: isConnected,
    broker: MQTT_BROKER_URL,
    port: MQTT_PORT,
    commandTopic: MQTT_TOPIC_COMMAND,
    responseTopic: MQTT_TOPIC_RESPONSE,
  };
};

// Initialize MQTT on module load
initializeMQTT();

export default {
  initializeMQTT,
  publishServoCommand,
  getMQTTStatus,
};