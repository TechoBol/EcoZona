import { useRef } from "react";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const useAmazonS3 = () => {
  // ✅ Se crea una sola vez, sincrónicamente, sin useEffect
  const s3Ref = useRef<S3Client>(
    new S3Client({
      region: "us-east-1",
      endpoint: import.meta.env.VITE_ACCOUNT_ID,
      credentials: {
        accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_ACCESS_KEY_SECRET,
      },
      forcePathStyle: true,
    }),
  );

  const uploadPDF = async (file: File, code:string) => {
    const key = `ECOZONA/SALES/${code}.pdf`;

    const signedUrl = await getSignedUrl(
      s3Ref.current,
      new PutObjectCommand({
        Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
        Key: key,
        ContentType: "application/pdf",
      }),
      { expiresIn: 3600 }
    );

    const response = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": "application/pdf",
      },
    });

    if (!response.ok) throw new Error("Error subiendo PDF");

    return key;
  };


  const uploadProductImage = async (file: File, name: string) => {
    const extension = file.type.split("/")[1] || "jpg";
    const key = `ECOZONA/PRODUCTS/${name}.${extension}`;

    const signedUrl = await getSignedUrl(
      s3Ref.current,
      new PutObjectCommand({
        Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
        Key: key,
        ContentType: file.type,
      }),
      { expiresIn: 3600 },
    );

    const response = await fetch(signedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!response.ok) throw new Error("Error subiendo imagen");

    return key;
  };

  const getFileUrl = async (key: string) => {
    const signedUrl = await getSignedUrl(
      s3Ref.current,
      new GetObjectCommand({
        Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
        Key: key,
      }),
      { expiresIn: 3600 },
    );

    return signedUrl;
  };

  return { uploadProductImage, getFileUrl, uploadPDF };
};
