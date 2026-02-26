export class ThumbnailError extends Error {
  public source_uuid: string;
  public originalError: any;

  constructor(originalError: any, source_uuid: string) {
    super(
      `Thumbnail generation failed: ${originalError.message || originalError}`,
    );
    this.name = 'ThumbnailError';
    this.source_uuid = source_uuid;
    this.originalError = originalError;

    if (originalError.stack) {
      this.stack += '\nCaused by: ' + originalError.stack;
    }
  }
}
