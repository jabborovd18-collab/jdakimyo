export const SICHQONCHA_YAW_KOEFFITSIYENTI = 0.0028;

export function pointerLockMavjudmi(element) {
  return Boolean(element && typeof element.requestPointerLock === "function");
}

/** Cheksiz yaw: hech qanday modulo yoki ekran kengligi chegarasi yo'q. */
export function yawniSiljit(holat, piksel, sezgirlik = 1) {
  if (!holat || !Number.isFinite(Number(piksel))) return 0;
  const farq = -Number(piksel) * Number(sezgirlik || 1) * SICHQONCHA_YAW_KOEFFITSIYENTI;
  holat.yaw += farq;
  return farq;
}
