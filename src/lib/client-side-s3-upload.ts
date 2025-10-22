/**
 * Type for file validation options
 */
export interface FileValidationOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  maxFiles?: number;
}

/**
 * Validates files before upload
 */
export function validateFiles(
  files: File[],
  options: FileValidationOptions = {}
): { valid: boolean; errors: string[] } {
  const {
    maxSizeInMB = 200,
    allowedTypes = [
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",

      // Documents
      "application/pdf",
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/vnd.oasis.opendocument.text", // .odt
      "text/plain", // .txt
      "text/rtf", // .rtf

      // Spreadsheets
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.oasis.opendocument.spreadsheet", // .ods

      // Presentations
      "application/vnd.ms-powerpoint", // .ppt
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      "application/vnd.oasis.opendocument.presentation", // .odp

      // Archives
      "application/zip",
      "application/x-zip-compressed",
      "application/x-rar-compressed",
      "application/x-7z-compressed",

      // Videos
      "video/mp4",
      "video/mpeg",
      "video/quicktime", // .mov
      "video/x-msvideo", // .avi
      "video/x-ms-wmv", // .wmv
      "video/webm",
      "video/3gpp", // .3gp
      "video/3gpp2", // .3g2
      "video/x-matroska", // .mkv

      // Other
      "application/xml",
      "text/csv",
      "text/markdown",
      "application/json",
    ],
    maxFiles = 100,
  } = options;

  const errors: string[] = [];
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (files.length > maxFiles) {
    errors.push(`Maximum number of files allowed is ${maxFiles}`);
    return { valid: false, errors };
  }

  files.forEach((file) => {
    if (file.size > maxSizeInBytes) {
      errors.push(`${file.name} exceeds the maximum size of ${maxSizeInMB}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(
        `${file.name} is an unsupported file type. Please zip the file and try again or contact support.`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
