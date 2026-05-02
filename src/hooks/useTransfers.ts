import { useEffect, useState } from "react";
import { useLoginStore } from "../components/store/loginStore";
import {
  createTransferService,
  getMyTransfersService,
  approveTransferService,
  rejectTransferService,
} from "../services/transferService";
import { useNavigate } from "react-router-dom";
import { generarTransferPDF } from "../components/pdf/generarTransferPDF";
import { useAmazonS3 } from "./useAmazonS3";
import socket from "../services/SocketIOConnection";

export const useTransfers = () => {
  const { token } = useLoginStore();
  const { uploadPDFTranfer } = useAmazonS3();

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const goToTransfer = () => {
    navigate("/transfer");
  };
  const getTransfers = async () => {
    const res = await getMyTransfersService(token);
    setData(res);
  };

  const createTransfer = async (values: any) => {
    const transfer = await createTransferService(values, token);
    const pdfBlob = generarTransferPDF(transfer);

    // 3. Convertir a File
    const file = new File([pdfBlob], `transfer_${transfer.transferCode}.pdf`, {
      type: "application/pdf",
    });

    // 4. Subir a S3
    const pdfKey = await uploadPDFTranfer(file, transfer.transferCode);

    console.log("PDF Transfer subido:", pdfKey);
    socket.emit("newCartProduct", transfer);
    await getTransfers();
  };
  const approveTransfer = async (id: number, fromLocationId: number) => {
    const transfer = await approveTransferService(id, fromLocationId, token);

    const pdfBlob = generarTransferPDF(transfer);

    // 3. Convertir a File
    const file = new File([pdfBlob], `transfer_${transfer.transferCode}.pdf`, {
      type: "application/pdf",
    });

    // 4. Subir a S3
    const pdfKey = await uploadPDFTranfer(file, transfer.transferCode);

    console.log("PDF Transfer subido:", pdfKey);
    socket.emit("newCartProduct", transfer);
    await getTransfers(); // refresca
  };

  const rejectTransfer = async (id: number) => {
    const transfer = await rejectTransferService(id, token);
    socket.emit("newCartProduct", transfer);
    await getTransfers();
  };

  useEffect(() => {
    socket.on("cartProduct", () => {
      getTransfers();
    });

    return () => {
      socket.off("cartProduct");
    };
  }, []);

  useEffect(() => {
    getTransfers();
  }, []);

  return {
    data,
    createTransfer,
    goToTransfer,
    approveTransfer,
    rejectTransfer,
  };
};
