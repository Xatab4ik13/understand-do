export function fitsPdfPage(y: number, height: number, pageHeight: number, margin: number) {
  return y + height <= pageHeight - margin;
}