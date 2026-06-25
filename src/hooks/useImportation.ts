import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { successToast, errorToast } from "../services/toasts";
import {
    getImportationsService,
    getImportationByIdService,
    changeImportationStatusService,
} from "../services/importationService";
import socket from "../services/SocketIOConnection";

export type ImportationStatus = "DRAFT" | "APPROVED" | "CANCELLED";

export const useImportation = ({ fetchOnMount = false } = {}) => {
    const location = useLocation();
    const { token } = useLoginStore();
    const navigate = useNavigate();

    const [importations, setImportations] = useState<Importation[]>([]);
    const [selectedImportation, setSelectedImportation] = useState<Importation | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState(false);

    // ─────────────────────────────────────────────
    // Reemplaza o inserta una importación en la lista
    // ─────────────────────────────────────────────
    const upsertImportation = (updated: Importation) => {
        setImportations((prev) => {
            const exists = prev.some((imp) => imp.id === updated.id);
            if (exists) return prev.map((imp) => imp.id === updated.id ? updated : imp);
            return [updated, ...prev];
        });
    };

    // ─────────────────────────────────────────────
    // GET ALL
    // ─────────────────────────────────────────────
    const getImportations = async () => {
        setLoading(true);
        try {
            const res = await getImportationsService(token);
            setImportations(res);
        } catch {
            errorToast("Error al obtener las importaciones");
        } finally {
            setLoading(false);
        }
    };

    // ─────────────────────────────────────────────
    // GET BY ID
    // ─────────────────────────────────────────────
    const getImportationById = async (id: number) => {
        setLoadingDetail(true);
        try {
            const res = await getImportationByIdService(id, token);
            setSelectedImportation(res);
        } catch {
            errorToast("Error al obtener el detalle de la importación");
        } finally {
            setLoadingDetail(false);
        }
    };

    // ─────────────────────────────────────────────
    // CAMBIAR ESTADO (APPROVED | CANCELLED)
    // ─────────────────────────────────────────────
    const changeStatus = async (id: number, status: "APPROVED" | "CANCELLED") => {
        setLoadingStatus(true);
        try {
            const updated = await changeImportationStatusService(id, status, token);

            // Actualizar lista y detalle abierto
            upsertImportation(updated);
            if (selectedImportation?.id === id) setSelectedImportation(updated);

            if (status === "APPROVED") {
                socket.emit("createProduct", updated);
            }

            const msg = status === "APPROVED"
                ? "Importación aprobada correctamente"
                : "Importación cancelada";
            successToast(msg);

            return updated;
        } catch (error: any) {
            errorToast(error.message || "No se pudo cambiar el estado");
            return null;
        } finally {
            setLoadingStatus(false);
        }
    };

    // ─────────────────────────────────────────────
    // NAVEGACIÓN
    // ─────────────────────────────────────────────
    const goToImportation = () => navigate("/importation");

    const goToEditImportation = (id: number) =>
        navigate(`/edit-importation/${id}`);

    // ─────────────────────────────────────────────
    // EFFECTS
    // ─────────────────────────────────────────────
    useEffect(() => {
        if (fetchOnMount) getImportations();
    }, []);

    // Si venimos de crear/editar con navigate state
    useEffect(() => {
        if (location.state?.newImportation) {
            upsertImportation(location.state.newImportation);
            window.history.replaceState({}, "");
        }
    }, []);

    // Socket — nueva importación creada por otro usuario
    useEffect(() => {
        const handleImportation = (importation: any) => {
            upsertImportation(importation);
        };

        socket.on("importation", handleImportation);
        return () => { socket.off("importation", handleImportation); };
    }, []);

    return {
        importations,
        selectedImportation,
        loading,
        loadingDetail,
        loadingStatus,
        getImportations,
        getImportationById,
        changeStatus,
        goToImportation,
        goToEditImportation,
        setSelectedImportation,
    };
};