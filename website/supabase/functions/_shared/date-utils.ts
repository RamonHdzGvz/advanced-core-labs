export function parseFormDate(dateIso: string): {
  month: string;
  day: string;
  year: string;
} {
  const date = new Date(dateIso);
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];

  return {
    month: months[date.getUTCMonth()],
    day: String(date.getUTCDate()),
    year: String(date.getUTCFullYear()),
  };
}
