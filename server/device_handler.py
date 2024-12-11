from netmiko import ConnectHandler
import sys
import json

def connect_to_device(device_config):
    try:
        connection = ConnectHandler(**device_config)
        return connection
    except Exception as e:
        return {"error": str(e)}

def execute_command(device_config, command, target):
    try:
        connection = connect_to_device(device_config)
        if isinstance(connection, dict) and "error" in connection:
            return json.dumps({"error": connection["error"]})
            
        command_templates = {
            "ping": f"ping {target}",
            "traceroute": f"traceroute {target}",
            "mtr": f"mtr {target}",
            "bgp": f"show ip bgp {target}"
        }
        
        if command not in command_templates:
            return json.dumps({"error": f"Invalid command: {command}"})
            
        output = connection.send_command(command_templates[command])
        connection.disconnect()
        return json.dumps({"output": output})
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    # Read input from stdin
    input_data = sys.stdin.read()
    try:
        data = json.loads(input_data)
        result = execute_command(data["device_config"], data["command"], data["target"])
        print(result)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
    except KeyError as e:
        print(json.dumps({"error": f"Missing required field: {str(e)}"}))
