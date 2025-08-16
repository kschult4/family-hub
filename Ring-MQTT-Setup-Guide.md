# Raspberry Pi Ring-MQTT & Mosquitto Setup

## Overview
This guide sets up Ring-MQTT with Mosquitto broker on Raspberry Pi to enable real-time motion alert data from Ring cameras for integration with the Family Hub dashboard.

## 1. SSH into Pi

```bash
ssh kschult4@raspberrypi
```

## 2. Check running containers

```bash
docker ps
```

## 3. Install netcat (to test ports)

```bash
sudo apt update
sudo apt install netcat-openbsd -y
```

## 4. Setup Mosquitto folders and permissions

```bash
mkdir -p ~/mosquitto/config ~/mosquitto/data ~/mosquitto/log
nano ~/mosquitto/config/mosquitto.conf
```

Add the following to `mosquitto.conf`:

```
listener 1883
allow_anonymous true
```

Then set permissions:

```bash
sudo chown -R kschult4:kschult4 ~/mosquitto
chmod 644 ~/mosquitto/config/mosquitto.conf
```

## 5. Create a user-defined Docker network

```bash
docker network create ringnet
```

## 6. Remove old containers (ignore errors if they do not exist)

```bash
docker rm -f mosquitto ring-mqtt
```

## 7. Start Mosquitto on the network

```bash
docker run -d \
  --name mosquitto \
  --network ringnet \
  -p 1883:1883 \
  -v ~/mosquitto/config:/mosquitto/config \
  -v ~/mosquitto/data:/mosquitto/data \
  -v ~/mosquitto/log:/mosquitto/log \
  eclipse-mosquitto:2
```

## 8. Start Ring-MQTT on the network

```bash
docker run -d \
  --name ring-mqtt \
  --network ringnet \
  -v ~/ring-mqtt/config:/data \
  -e MQTT_SERVER="mqtt://mosquitto:1883" \
  -e RING_DEBUG=1 \
  tsightler/ring-mqtt:latest
```

## 9. Test connectivity from Ring-MQTT to Mosquitto

```bash
docker exec -it ring-mqtt ping -c 3 mosquitto
docker exec -it ring-mqtt nc -vz mosquitto 1883
```

## 10. Subscribe to all MQTT topics for debugging

```bash
docker exec -it mosquitto mosquitto_sub -h localhost -t '#' -v
```

## 11. Access Ring-MQTT web UI

* Open a browser on the Pi or any device on the same network.
* URL: `http://<pi-ip-address>:55123/`
* Generate the token to authenticate Ring-MQTT with your Ring account.

## 12. Notes

* Using container names (`mosquitto`) instead of IP ensures reliability even if Pi's IP changes.
* Mosquitto volumes persist configuration, logs, and data.
* Ring-MQTT volumes persist configuration and state.
* Make sure firewall rules allow port 1883 and 55123 for LAN access.

## Integration with Family Hub

### MQTT Topics for Ring Devices
Ring-MQTT publishes motion events to topics like:
```
ring/<location-id>/alarm/<device-type>/<device-id>/motion/state
ring/<location-id>/camera/<device-id>/motion/state
```

### Connecting to Family Hub Dashboard
1. Configure MQTT client in Family Hub to connect to Pi's IP:1883
2. Subscribe to Ring motion topics
3. Update RingCameraWidget component to display real-time motion alerts
4. Integrate with Home Assistant via MQTT discovery for unified dashboard

### Example MQTT Message
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "state": "ON",
  "device": "Front Door Camera",
  "location": "Home"
}
```

### Security Considerations
- Consider enabling MQTT authentication for production
- Use SSL/TLS for MQTT connections in production environments
- Implement proper firewall rules to restrict MQTT access to trusted devices