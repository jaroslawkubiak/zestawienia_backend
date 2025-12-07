import { Request } from 'express';

function normalizeAddress(addr: string): string {
  if (!addr) return addr;

  // If IPv4 with port -> remove port
  const ipv4WithPort = addr.match(/^(\d+\.\d+\.\d+\.\d+):(\d+)$/);
  if (ipv4WithPort) {
    return ipv4WithPort[1]; // only IP
  }

  // IPv4-mapped IPv6 -> convert to IPv4
  const ipv4Mapped = addr.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (ipv4Mapped) {
    return ipv4Mapped[1];
  }

  // ::1 → localhost
  if (addr === '::1') return '127.0.0.1';

  return addr; // keep IPv6 as is
}

export function getClientIp(req: Request): string | null {
  // 1) Express stores header names in lowercase
  const xff = req.headers['x-forwarded-for'];

  // If header exists as string -> take the first IP from the list
  if (typeof xff === 'string' && xff.trim().length > 0) {
    const first = xff.split(',')[0].trim();
    return normalizeAddress(first);
  }

  // If header exists as array (less common)
  if (Array.isArray(xff) && xff.length > 0) {
    return normalizeAddress(String(xff[0]).trim());
  }

  // 2) If trust proxy = true and proxy forwarded IPs, Express may populate req.ips (array)
  // req.ips is empty if trust proxy is not enabled
  if (Array.isArray((req as any).ips) && (req as any).ips.length > 0) {
    return normalizeAddress((req as any).ips[0]);
  }

  // 3) req.ip (Express) - may use XFF if trust proxy = true
  if (typeof req.ip === 'string' && req.ip.length > 0) {
    return normalizeAddress(req.ip);
  }

  // 4) socket remote address
  if (req.socket && typeof req.socket.remoteAddress === 'string') {
    return normalizeAddress(req.socket.remoteAddress);
  }

  // 5) fallback (old API)
  const conn: any = (req as any).connection;
  if (conn && typeof conn.remoteAddress === 'string') {
    return normalizeAddress(conn.remoteAddress);
  }

  return null;
}
