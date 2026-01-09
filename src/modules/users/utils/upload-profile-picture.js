'use strict';

const { minioClient } = require('../../../config/minio');

module.exports = async function uploadProfilePicture({
  file,
  firstName,
  lastName,
}) {
  const bucket = process.env.MINIO_BUCKET_NAME;

  const ext = file.originalname.split('.').pop();
  const objectName = `profiles/${firstName}-${lastName}.${ext}`.toLowerCase();

  await minioClient.putObject(
    bucket,
    objectName,
    file.buffer,
    {
      'Content-Type': file.mimetype,
    }
  );

  const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';

  return `${protocol}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${objectName}`;
};
