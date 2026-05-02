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
import { notificationToast } from "../services/toasts";
import { useNotificationStore } from "../components/store/notificationStore";

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
    socket.emit("newTranfer", "Nueva transferencia " + transfer.transferCode +"  solicitada");
    await getTransfers();
  };

  const approveTransfer = async (id: number, fromLocationId: number) => {
    const transfer = await approveTransferService(id, fromLocationId, token);
    console.log(transfer)
    const pdfBlob = generarTransferPDF(transfer);

    // 3. Convertir a File
    const file = new File([pdfBlob], `transfer_${transfer.transferCode}.pdf`, {
      type: "application/pdf",
    });

    // 4. Subir a S3
    const pdfKey = await uploadPDFTranfer(file, transfer.transferCode);

    console.log("PDF Transfer subido:", pdfKey);
    socket.emit("newTranfer", "Transferencia " + transfer.transferCode +" aprobada");
    await getTransfers();
  };

  const rejectTransfer = async (id: number) => {
    const transfer = await rejectTransferService(id, token);
    socket.emit("newTranfer", "Transferencia " + transfer.transferCode +"  rechazada");
    await getTransfers();
  };

  useEffect(() => {
    socket.on("transfer", (mensaje) => {
      notificationToast(mensaje)
      setTransferNotification(true);
      getTransfers();
    });

    return () => {
      socket.off("transfer");
    };
  }, []);

  useEffect(() => {
    getTransfers();
  }, []);

  const setTransferNotification = useNotificationStore(
    (state) => state.setTransferNotification,
  );
  return {
    data,
    createTransfer,
    goToTransfer,
    approveTransfer,
    rejectTransfer,
  };
};
