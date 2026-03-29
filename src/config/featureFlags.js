export const smokeRoutesEnabled = Boolean(
  import.meta.env?.DEV || import.meta.env?.VITE_ENABLE_SMOKE_ROUTES === 'true',
);
