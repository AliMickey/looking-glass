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
            
        # Use the command template from the input data
        command_template = device_config.get('command_template')
        if not command_template:
            return json.dumps({"error": "Command template not provided"})
            
        try:
            cmd = command_template.format(target=target)
            output = connection.send_command(cmd, read_timeout=30)
            if not output.strip():
                return json.dumps({"error": "Command returned no output"})
            connection.disconnect()
            return json.dumps({"output": output})
        except Exception as cmd_error:
            if "timeout" in str(cmd_error).lower():
                return json.dumps({"error": "Command timed out. The device took too long to respond."})
            return json.dumps({"error": f"Command execution failed: {str(cmd_error)}"})
    except Exception as e:
        if "Authentication failed" in str(e):
            return json.dumps({"error": "Authentication failed. Please check device credentials."})
        elif "timed out" in str(e).lower():
            return json.dumps({"error": "Connection timed out. Device might be unreachable."})
        elif "Connection refused" in str(e):
            return json.dumps({"error": "Connection refused. Device might be down or unreachable."})
        return json.dumps({"error": f"Failed to connect: {str(e)}"})

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
