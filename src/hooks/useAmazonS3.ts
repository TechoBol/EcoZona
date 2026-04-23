import { useEffect, useState } from "react";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const useAmazonS3 = () => {
  const [s3, setS3] = useState<S3Client | null>(null);

  useEffect(() => {
    const client = new S3Client({
      region: "us-east-1",
      endpoint: import.meta.env.VITE_ACCOUNT_ID,
      credentials: {
        accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_ACCESS_KEY_SECRET,
      },
      forcePathStyle: true,
    });

    setS3(client);
  }, []);

  const uploadProductImage = async (file: File, name: string) => {
    if (!s3) throw new Error("S3 no inicializado");

    const extension = file.type.split("/")[1] || "jpg";
    const key = `ECOZONA/PRODUCTS/${name}.${extension}`;

    const signedUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
        Key: key,
        ContentType: file.type,
      }),
      { expiresIn: 3600 }
    );

    const response = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Error subiendo imagen");
    }

    return key; // 🔥 esto guardas en BD
  };

  // 🔥 OBTENER URL PARA MOSTRAR
  const getFileUrl = async (key: string) => {
    if (!s3) throw new Error("S3 no inicializado");

    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
        Key: key,
      }),
      { expiresIn: 3600 }
    );

    return signedUrl;
  };

  return {
    uploadProductImage,
    getFileUrl,
  };
};