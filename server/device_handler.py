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
            "bgp_path": f"show ip bgp paths {target}",
            "bgp_community": f"show ip bgp community {target}",
            "bgp_route": f"show ip bgp {target}"
        }
        
        command_type = command.split('_')[0] if '_' in command else command
        if command_type not in command_templates and command not in command_templates:
            return json.dumps({"error": f"Invalid command: {command}"})
            
        try:
            cmd = command_templates.get(command) or command_templates.get(command_type)
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
