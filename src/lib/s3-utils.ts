/**
 * Utility functions for handling S3 URLs and CORS issues
 */

/**
 * Converts an S3 URL to use our proxy endpoint to avoid CORS issues
 * @param s3Url - The original S3 URL
 * @returns The proxy URL or original URL if it's not an S3 URL
 */
export function getProxyUrl(s3Url: string | null | undefined): string | undefined {
  if (!s3Url) return undefined;
  
  // Check if it's an S3 URL
  const s3Pattern = /https:\/\/[^\/]+\.s3\.[^\/]+\.amazonaws\.com\/(.+)/;
  const match = s3Url.match(s3Pattern);
  
  if (match) {
    // Extract the object key from the S3 URL
    const objectKey = match[1];
    return `/api/proxy-file?key=${encodeURIComponent(objectKey)}`;
  }
  
  // If it's already a proxy URL or not an S3 URL, return as is
  return s3Url;
}

/**
 * Checks if a URL is an S3 URL
 * @param url - The URL to check
 * @returns True if it's an S3 URL
 */
export function isS3Url(url: string | null | undefined): boolean {
  if (!url) return false;
  return /https:\/\/[^\/]+\.s3\.[^\/]+\.amazonaws\.com\//.test(url);
}

/**
 * Gets the file name from an S3 URL
 * @param s3Url - The S3 URL
 * @returns The file name or undefined
 */
export function getFileNameFromS3Url(s3Url: string | null | undefined): string | undefined {
  if (!s3Url) return undefined;
  
  const s3Pattern = /https:\/\/[^\/]+\.s3\.[^\/]+\.amazonaws\.com\/(.+)/;
  const match = s3Url.match(s3Pattern);
  
  if (match) {
    const objectKey = match[1];
    // Extract filename from the object key (remove timestamp prefix)
    const fileName = objectKey.split('/').pop();
    return fileName ? decodeURIComponent(fileName) : undefined;
  }
  
  return undefined;
}
