let uid = 1;
export function useId(prefix = "y") {
  return `${prefix}-${Date.now()}-${uid++}`;
}

