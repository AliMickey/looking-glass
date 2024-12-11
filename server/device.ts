import { spawn } from 'child_process';
import { DEVICES } from "./config";
import type { DeviceConfig } from "@/lib/types";

const VALID_COMMANDS = ['ping', 'traceroute', 'mtr', 'bgp'];

export async function executeCommand(deviceHost: string, command: string, target: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const device = DEVICES[deviceHost];
    if (!device) {
      reject(new Error(`Device ${deviceHost} not found`));
      return;
    }

    if (!VALID_COMMANDS.includes(command)) {
      reject(new Error(`Invalid command: ${command}`));
      return;
    }

    const pythonProcess = spawn('python3', ['server/device_handler.py']);
    
    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${errorData}`));
        return;
      }

      try {
        const result = JSON.parse(outputData);
        if (result.error) {
          reject(new Error(result.error));
        } else {
          resolve(result.output);
        }
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${error instanceof Error ? error.message : String(error)}`));
      }
    });

    // Send device configuration and command to Python script
    const input = JSON.stringify({
      device_config: device,
      command,
      target
    });
    
    pythonProcess.stdin.write(input);
    pythonProcess.stdin.end();
  });
}
