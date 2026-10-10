export function formatRupiah(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateIndo(date = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}

export function generateOrderId() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${dateStr}-${randomNum}`;
}

export function generateResi(courierCode = "JNE") {
  const prefix = courierCode.toUpperCase().slice(0, 3);
  const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
  return `${prefix}${randomNum}ID`;
}
