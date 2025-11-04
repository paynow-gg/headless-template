const ipv4Regex =
  /^(?!(?:10|127|169\.254|172\.(?:1[6-9]|2\d|3[01])|192\.168|224|240)\.)(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

const ipv6Regex =
  /^(?!.*::.*::)(?!.*::1$)(?!fe80:)(?!fc00:)(?!ff00:)([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}$|^(?!.*::.*::)(?!.*::1$)(?!fe80:)(?!fc00:)(?!ff00:)([0-9a-fA-F]{1,4}:)*::([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$|^::$/;

export default function isValidPublicIP(ip?: string): boolean {
  if (!ip) {
    return false;
  }

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
