/*
  Pet Feeder IoT - NodeMCU (ESP-12E) Version
  Controls a servo motor to dispense pet food based on commands from MQTT broker
  
  Hardware Connections:
  - Servo Motor Signal Pin -> D1 (GPIO 5)
  - Servo Motor VCC -> 5V
  - Servo Motor GND -> GND
  
  Required Libraries:
  - PubSubClient (for MQTT)
  - ArduinoJson (for JSON parsing)
  - Servo (built-in)
*/

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <Servo.h>
#include <ArduinoJson.h>

// WiFi credentials - UPDATE THESE WITH YOUR NETWORK DETAILS
const char *ssid = "ChamundaKrupa";
const char *password = "aA@123456";

// MQTT Broker settings
const char *mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char *mqtt_topic_command = "petfeeder/servo";
const char *mqtt_topic_response = "petfeeder/servo/response";

// Servo settings
#define SERVO_PIN D1  // GPIO 5 for NodeMCU
Servo servoMotor;

// Client instances
WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Variables
bool isFeeding = false;
unsigned long feedingStartTime = 0;
int targetAngle = 0;
int feedingDuration = 2000; // Default 2 seconds

void setup()
{
    Serial.begin(115200);
    Serial.println();
    Serial.println("=========================================");
    Serial.println("🐾 NodeMCU Pet Feeder Starting...");
    Serial.println("=========================================");

    // Initialize servo
    servoMotor.attach(SERVO_PIN);
    servoMotor.write(0); // Initial position (closed)
    Serial.println("🔧 Servo initialized at position 0");

    // Connect to WiFi
    setupWiFi();

    // Setup MQTT
    mqttClient.setServer(mqtt_server, mqtt_port);
    mqttClient.setCallback(mqttCallback);

    Serial.println("✅ Setup complete!");
    Serial.println("=========================================");
}

void loop()
{
    // Maintain MQTT connection
    if (!mqttClient.connected()) {
        reconnectMQTT();
    }
    mqttClient.loop();

    // Handle feeding operation
    if (isFeeding) {
        unsigned long elapsed = millis() - feedingStartTime;

        if (elapsed < feedingDuration) {
            // Keep servo at target angle
            servoMotor.write(targetAngle);
        } else {
            // Feeding complete, return to closed position
            servoMotor.write(0);
            isFeeding = false;
            Serial.println("✅ Feeding complete");
            sendMQTTResponse("feeding_complete", "success");
        }
    }

    delay(10);
}

void setupWiFi()
{
    Serial.print("Connecting to WiFi: ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);

    unsigned long startAttemptTime = millis();

    while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 15000) {
        delay(500);
        Serial.print(".");
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println();
        Serial.println("✅ WiFi Connected!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
    } else {
        Serial.println();
        Serial.println("❌ WiFi Connection Failed!");
        Serial.println("Please check your WiFi credentials and try again.");
        Serial.print("SSID: ");
        Serial.println(ssid);
        Serial.print("Password length: ");
        Serial.println(strlen(password));
    }
}

void reconnectMQTT()
{
    static unsigned long lastAttempt = 0;
    if (millis() - lastAttempt < 5000) return; // Limit reconnection attempts
    lastAttempt = millis();
    
    Serial.print("Connecting to MQTT...");
    
    String clientId = "NodeMCU_PetFeeder_";
    clientId += String(ESP.getChipId(), HEX);

    if (mqttClient.connect(clientId.c_str())) {
        Serial.println("✅ MQTT Connected!");
        mqttClient.subscribe(mqtt_topic_command);
        Serial.println("📡 Subscribed to command topic: " + String(mqtt_topic_command));
    } else {
        Serial.print("❌ Failed, rc=");
        Serial.print(mqttClient.state());
        Serial.println(" Retrying in 5 seconds...");
    }
}

void mqttCallback(char *topic, byte *payload, unsigned int length)
{
    Serial.println("📥 Message received on topic: " + String(topic));
    
    // Convert payload to string
    String message = "";
    for (unsigned int i = 0; i < length; i++) {
        message += (char)payload[i];
    }

    Serial.print("📄 Payload: ");
    Serial.println(message);

    // Parse JSON
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, message);

    if (error) {
        Serial.println("❌ JSON parsing failed: " + String(error.c_str()));
        return;
    }

    // Extract command data
    String action = doc["action"];
    Serial.println("⚡ Action received: " + action);

    if (action == "feed") {
        targetAngle = doc["angle"] | 90;
        feedingDuration = doc["duration"] | 2000;

        Serial.println("🎯 Dispensing food...");
        Serial.print("   Angle: ");
        Serial.println(targetAngle);
        Serial.print("   Duration: ");
        Serial.print(feedingDuration);
        Serial.println("ms");

        // Start feeding
        isFeeding = true;
        feedingStartTime = millis();
        servoMotor.write(targetAngle);
        Serial.println("⚙️ Servo moved to position " + String(targetAngle));

        sendMQTTResponse("feeding_started", "in-progress");
    }
    else if (action == "stop") {
        Serial.println("🛑 Emergency stop!");
        isFeeding = false;
        servoMotor.write(0);
        Serial.println("⚙️ Servo moved to position 0");
        sendMQTTResponse("feeding_stopped", "success");
    } else {
        Serial.println("❓ Unknown action: " + action);
    }
}

void sendMQTTResponse(String event, String status)
{
    StaticJsonDocument<128> doc;
    doc["event"] = event;
    doc["status"] = status;
    doc["timestamp"] = millis();

    char buffer[128];
    serializeJson(doc, buffer);

    boolean result = mqttClient.publish(mqtt_topic_response, buffer);
    if (result) {
        Serial.print("📤 Response sent: ");
        Serial.println(buffer);
    } else {
        Serial.println("❌ Failed to send response");
    }
}