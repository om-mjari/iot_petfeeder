/*
 * Arduino Pet Feeder - Servo Motor Control
 *
 * For Arduino boards (Uno, Nano, Mega, etc.)
 * This version uses Serial communication instead of WiFi/MQTT
 *
 * Hardware Requirements:
 * - Arduino Board (Uno/Nano/Mega)
 * - Servo Motor (SG90 or similar)
 * - Power Supply (5V for servo)
 * - USB Cable for Serial communication
 *
 * Connections:
 * - Servo Signal Pin -> Pin 9 (Arduino)
 * - Servo VCC -> 5V
 * - Servo GND -> GND
 */

#include <Servo.h>

#define SERVO_PIN 9

Servo servoMotor;
bool isFeeding = false;
unsigned long feedingStartTime = 0;
int targetAngle = 0;
int feedingDuration = 2000;

void setup()
{
    Serial.begin(9600);
    Serial.println("🐾 Arduino Pet Feeder Starting...");

    servoMotor.attach(SERVO_PIN);
    servoMotor.write(0); // Closed position

    Serial.println("✅ Setup complete!");
    Serial.println("Commands:");
    Serial.println("  FEED:<angle>:<duration> - Dispense food");
    Serial.println("  STOP - Stop feeding");
    Serial.println("Example: FEED:90:2000");
}

void loop()
{
    // Check for serial commands
    if (Serial.available() > 0)
    {
        String command = Serial.readStringUntil('\n');
        command.trim();
        processCommand(command);
    }

    // Handle feeding operation
    if (isFeeding)
    {
        unsigned long elapsed = millis() - feedingStartTime;

        if (elapsed < feedingDuration)
        {
            servoMotor.write(targetAngle);
        }
        else
        {
            servoMotor.write(0);
            isFeeding = false;
            Serial.println("✅ Feeding complete");
        }
    }

    delay(10);
}

void processCommand(String command)
{
    Serial.print("📨 Command received: ");
    Serial.println(command);

    if (command.startsWith("FEED:"))
    {
        // Parse FEED:angle:duration
        int firstColon = command.indexOf(':');
        int secondColon = command.indexOf(':', firstColon + 1);

        if (firstColon > 0 && secondColon > 0)
        {
            String angleStr = command.substring(firstColon + 1, secondColon);
            String durationStr = command.substring(secondColon + 1);

            targetAngle = angleStr.toInt();
            feedingDuration = durationStr.toInt();

            if (targetAngle >= 0 && targetAngle <= 180 && feedingDuration > 0)
            {
                Serial.println("🎯 Dispensing food...");
                Serial.print("Angle: ");
                Serial.println(targetAngle);
                Serial.print("Duration: ");
                Serial.println(feedingDuration);

                isFeeding = true;
                feedingStartTime = millis();
                servoMotor.write(targetAngle);
            }
            else
            {
                Serial.println("❌ Invalid parameters");
            }
        }
        else
        {
            Serial.println("❌ Invalid command format");
        }
    }
    else if (command == "STOP")
    {
        Serial.println("🛑 Emergency stop!");
        isFeeding = false;
        servoMotor.write(0);
        Serial.println("✅ Stopped");
    }
    else
    {
        Serial.println("❌ Unknown command");
    }
}
