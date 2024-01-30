export default function generateUniqueId(): string {
  // might use uuid or any other library
  return Math.random().toString(36).substring(2, 9);
}
