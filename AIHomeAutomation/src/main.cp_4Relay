#include <ESP8266WiFi.h>
#include <ESP8266mDNS.h>
#include <Ticker.h>
#include <AsyncMqttClient.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>

#ifndef LED_BUILTIN
#define LED_BUILTIN 2 // GPIO5 D4
#endif

#define MQTT_HOST "broker.emqx.io"
#define MQTT_PORT 1883
#define MQTT_SUB_PATH_SUB "/amankrokx-esp/bedroom/sub"
#define MQTT_SUB_PATH_PUB "/amankrokx-esp/bedroom/pub"

// these turn on when LOW
#define LAMP1 5 // GPIO5 D1
#define LAMP2 4 // GPIO5 D2
#define FAN 14  // GPIO5 D5
#define AC 12   // GPIO5 D6

// State variables
bool lamp1State = false;
bool lamp2State = false;
bool fanState = false;
bool acState = false;

const char *ssid = "Mi9tpro";
const char *password = "amankrokx";
bool ledState = false;

// Set your Static IP address
// 171 for esp-01, 172 for esp big one
// IPAddress local_IP(192, 168, 1, 172);
// Set your Gateway IP address
// IPAddress gateway(192, 168, 1, 1);
// Set your SubnetMask
// IPAddress subnet(255, 255, 255, 0);

AsyncMqttClient mqttClient;
WiFiEventHandler wifiConnectHandler, wifiDisconnectHandler;
Ticker mqttReconnectTimer, ledBlink, wifiReconnectTimer;

// declare functions
void connectToWifi();
void connectToMqtt();
void onWifiConnect(const WiFiEventStationModeGotIP &event);
void onWifiDisconnect(const WiFiEventStationModeDisconnected &event);
void onMqttConnect(bool sessionPresent);
void onMqttDisconnect(AsyncMqttClientDisconnectReason reason);
void onMqttSubscribe(uint16_t packetId, uint8_t qos);
void onMqttUnsubscribe(uint16_t packetId);
void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total);
void ledBlinkCallback();

// led blink callback
void ledBlinkCallback()
{
  ledState = !ledState;
  digitalWrite(LED_BUILTIN, ledState);
}

// connect to wifi
void connectToWifi()
{
  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
}

// connect to mqtt
void connectToMqtt()
{
  Serial.println("Connecting to MQTT...");
  mqttClient.connect();
}

// on wifi connected
void onWifiConnect(const WiFiEventStationModeGotIP &event)
{
  Serial.println("Connected to Wi-Fi.");
  connectToMqtt();
}

// on wifi disconnected
void onWifiDisconnect(const WiFiEventStationModeDisconnected &event)
{
  Serial.println("Disconnected from Wi-Fi.");
  mqttReconnectTimer.detach(); // ensure we don't reconnect to MQTT while reconnecting to Wi-Fi
  wifiReconnectTimer.once(2, connectToWifi);
}

// on mqtt connected
void onMqttConnect(bool sessionPresent)
{
  // detach mqtt reconnect timer
  mqttReconnectTimer.detach();
  Serial.println("Connected to MQTT.");
  Serial.print("Session present: ");
  Serial.println(sessionPresent);
  // subscribe to mqtt topic
  mqttClient.subscribe(MQTT_SUB_PATH_SUB, 0);
  // publish to mqtt topic on connect
  mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, "Hello from esp8266 bedroom");
}

// on mqtt disconnected
void onMqttDisconnect(AsyncMqttClientDisconnectReason reason)
{
  Serial.println("Disconnected from MQTT. Reconnecting...");
  mqttReconnectTimer.once(2, connectToWifi);
}

// on mqtt subscribe
void onMqttSubscribe(uint16_t packetId, uint8_t qos)
{
  Serial.println("Subscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
  Serial.print("  qos: ");
  Serial.println(qos);
}

// on mqtt unsubscribe
void onMqttUnsubscribe(uint16_t packetId)
{
  Serial.println("Unsubscribe acknowledged.");
  Serial.print("  packetId: ");
  Serial.println(packetId);
}

void handlePayload(const char *payload)
{
  // example string: lamp1=1&lamp2=0&fan=1&ac=0
  // split by & and then by =
  // then check if key is lamp1, lamp2, fan, ac
  // if yes then check if value is 1 or 0
  // if 1 then turn on else turn off
  // also broadcast over mqtt that the device is on
  char *token = strtok((char *)payload, "&");

  while (token != NULL)
  {
    if (strncmp("lamp1=", token, 6) == 0)
    {
      // lamp1
      if (token[6] == '1')
      {
        // turn on
        digitalWrite(LAMP1, LOW);
        lamp1State = true;
        // Broadcast over MQTT that the device is on
        // Replace "your_topic" with the appropriate topic for your MQTT broker
        mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, "Lamp1 is ON");
      }
      else
      {
        // turn off
        digitalWrite(LAMP1, HIGH);
        lamp1State = false;
        // Broadcast over MQTT that the device is on
        // Replace "your_topic" with the appropriate topic for your MQTT broker
        mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, "Lamp1 is OFF");
      }
    }
    if (strncmp("lamp2=", token, 6) == 0)
    {
      // lamp2
      if (token[6] == '1')
      {
        // turn on
        digitalWrite(LAMP2, LOW);
        lamp2State = true;
        // Broadcast over MQTT that the device is on
        // Replace "your_topic" with the appropriate topic for your MQTT broker
        mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, "Lamp2 is ON");
      }
      else
      {
        // turn off
        digitalWrite(LAMP2, HIGH);
        lamp2State = false;
        // Broadcast over MQTT that the device is on
        // Replace "your_topic" with the appropriate topic for your MQTT broker
        mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, "Lamp2 is OFF");
      }
    }
    if (strncmp("fan=", token, 4) == 0)
    {
      // fan
      if (token[4] == '1')
      {
        // turn on
        digitalWrite(FAN, LOW);
        fanState = true;
        // Broadcast over MQTT that the device is on
        // Replace "your_topic" with the appropriate topic for your MQTT broker
        mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, "Fan is ON");
      }
      else
      {
        // turn off
        digitalWrite(FAN, HIGH);
        fanState = false;
        // Broadcast over MQTT that the device is on
        // Replace "your_topic" with the appropriate topic for your MQTT broker
        mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, "Fan is OFF");
      }
    }
    if (strncmp("ac=", token, 3) == 0)
    {
      // ac
      if (token[3] == '1')
      {
        // turn on
        digitalWrite(AC, LOW);
        acState = true;
        // Broadcast over MQTT that the device is on
        // Replace "your_topic" with the appropriate topic for your MQTT broker
        mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, "AC is ON");
      }
      else
      {
        // turn off
        digitalWrite(AC, HIGH);
        acState = false;
        // Broadcast over MQTT that the device is on
        // Replace "your_topic" with the appropriate topic for your MQTT broker
        mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, "AC is OFF");
      }
    }
    token = strtok(NULL, "&");
  }
  // Broadcast over MQTT that the device is on
  // Replace "your_topic" with the appropriate topic for your MQTT broker
}

// publish state of all devices to mqtt
void publishState()
{
  // example string: lamp1=1&lamp2=0&fan=1&ac=0
  // split by & and then by =
  // then check if key is lamp1, lamp2, fan, ac
  // if yes then check if value is 1 or 0
  // if 1 then turn on else turn off
  // also broadcast over mqtt that the device is on
  char payload[100];
  sprintf(payload, "outData:lamp1=%d&lamp2=%d&fan=%d&ac=%d", lamp1State, lamp2State, fanState, acState);
  mqttClient.publish(MQTT_SUB_PATH_PUB, 0, true, payload);
}


// on mqtt message
void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index, size_t total)
{
  Serial.println("Publish received.");
  Serial.print("  topic: ");
  Serial.println(topic);
  Serial.print("  qos: ");
  Serial.println(properties.qos);
  Serial.print("  dup: ");
  Serial.println(properties.dup);
  Serial.print("  retain: ");
  Serial.println(properties.retain);
  Serial.print("  len: ");
  Serial.println(len);
  Serial.print("  index: ");
  Serial.println(index);
  Serial.print("  total: ");
  Serial.println(total);
  // check payload and take action
  // payload is in key = value format
  // keys are lamp1, lamp2, fan, ac
  // values are 1 means on and 0 means off
  // example payload: lamp1=1&lamp2=0&fan=1&ac=0
  // split them and call digitalWrite accordingly, 
  // pin names are defined as LAMP1, LAMP2, FAN, AC
  // also broadcast over mqtt that the device is on
  if (strncmp("getState", payload, 8) == 0) {
    // publish state of all devices to mqtt
    publishState();
  } else {
    handlePayload(payload);
  }
}

void setup()
{
  Serial.begin(115200);
  Serial.println("Booting");
  // set pin modes
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(LAMP1, OUTPUT);
  pinMode(LAMP2, OUTPUT);
  pinMode(FAN, OUTPUT);
  pinMode(AC, OUTPUT);

  // turn off all devices
  digitalWrite(LED_BUILTIN, HIGH);
  digitalWrite(LAMP1, HIGH);
  digitalWrite(LAMP2, HIGH);
  digitalWrite(FAN, HIGH);
  digitalWrite(AC, HIGH);

  // Configures static IP address
  // if (!WiFi.config(local_IP, gateway, subnet)) {
  //   Serial.println("STA Failed to configure");
  // }
  WiFi.mode(WIFI_STA);

  wifiConnectHandler = WiFi.onStationModeGotIP(onWifiConnect);
  wifiDisconnectHandler = WiFi.onStationModeDisconnected(onWifiDisconnect);
  mqttClient.onConnect(onMqttConnect);
  mqttClient.onDisconnect(onMqttDisconnect);
  mqttClient.onSubscribe(onMqttSubscribe);
  mqttClient.onUnsubscribe(onMqttUnsubscribe);
  mqttClient.onMessage(onMqttMessage);
  mqttClient.setServer(MQTT_HOST, MQTT_PORT);

  connectToWifi();

  // Port defaults to 8266
  // ArduinoOTA.setPort(8266);

  // Hostname defaults to esp8266-[ChipID]
  ArduinoOTA.setHostname("myesp82661");

  // No authentication by default
  // ArduinoOTA.setPassword("admin");

  // Password can be set with it's md5 value as well
  // MD5(admin) = 21232f297a57a5a743894a0e4a801fc3
  // ArduinoOTA.setPasswordHash("21232f297a57a5a743894a0e4a801fc3");

  ArduinoOTA.onStart([]()
                     {
    String type;
    if (ArduinoOTA.getCommand() == U_FLASH) {
      type = "sketch";
    } else {  // U_FS
      type = "filesystem";
    }
    // NOTE: if updating FS this would be the place to unmount FS using FS.end()
    Serial.println("Start updating " + type); });

  ArduinoOTA.onEnd([]()
                   { Serial.println("\nEnd"); });

  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total)
                        { Serial.printf("Progress: %u%%\r", (progress / (total / 100))); });

  ArduinoOTA.onError([](ota_error_t error)
                     {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) {
      Serial.println("Auth Failed");
    } else if (error == OTA_BEGIN_ERROR) {
      Serial.println("Begin Failed");
    } else if (error == OTA_CONNECT_ERROR) {
      Serial.println("Connect Failed");
    } else if (error == OTA_RECEIVE_ERROR) {
      Serial.println("Receive Failed");
    } else if (error == OTA_END_ERROR) {
      Serial.println("End Failed");
    } });

  ArduinoOTA.begin();
  Serial.println("Ready");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // blink builtin led asynchrously without using delay
  ledBlink.attach(0.5, ledBlinkCallback);
}

void loop()
{
  ArduinoOTA.handle();

  if (!mqttClient.connected())
  {
    mqttReconnectTimer.detach();
    mqttReconnectTimer.once(2, connectToMqtt);
  }
}