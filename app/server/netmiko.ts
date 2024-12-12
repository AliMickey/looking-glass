import { ConnectHandler } from "netmiko";
import type { DeviceConfig } from "@/lib/types";

export async function ConnectToDevice(deviceConfig: DeviceConfig) {
  try {
    return await ConnectHandler(deviceConfig);
  } catch (error) {
    throw new Error(`Failed to connect to device: ${error.message}`);
  }
}
