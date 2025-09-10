import dayjs from "dayjs";
export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

export function formatDate(date: Date) {
  return dayjs(date).format("D MMMM YYYY");
}
