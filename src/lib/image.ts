/** Build a data URL from base64 image data */
export function buildImageSrc(mediaType: string, data?: string, url?: string): string {
  if (url) return url;
  if (data) return `data:${mediaType};base64,${data}`;
  return '';
}
