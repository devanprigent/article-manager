import { useHealth } from '../../hooks/queries';

// Isolated so health polling re-renders this leaf instead of the whole app
export function HealthPoller() {
  useHealth();
  return null;
}
