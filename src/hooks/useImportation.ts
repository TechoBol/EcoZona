import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { successToast, errorToast } from "../services/toasts";
import {
    getImportationsService,
    getImportationByIdService,
} from "../services/importationService";
import socket from "../services/SocketIOConnection";

export const useImportation = ({ fetchOnMount = false } = {}) => {
    const location = useLocation();
    const { token } = useLoginStore();
    const navigate = useNavigate();
    const [importations, setImportations] = useState<Importation[]>([]);
    const [selectedImportation, setSelectedImportation] = useState<Importation | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

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

    const goToImportation = () => navigate("/importation");

    useEffect(() => {
        if (fetchOnMount) getImportations();
    }, []);

    useEffect(() => {
        if (location.state?.newImportation) {
            setImportations((prev) => [...prev, location.state.newImportation]);
            window.history.replaceState({}, "");
        }
    }, []);

    useEffect(() => {
        const handleImportation = (importation: any) => {
            setImportations((prev) => {
                const exists = prev.some((imp) => imp.id === importation.id);
                if (exists) return prev;
                return [importation, ...prev];
            });
        };

        socket.on("importation", handleImportation);

        return () => {
            socket.off("importation", handleImportation);
        };
    }, []);

    return {
        importations,
        selectedImportation,
        loading,
        loadingDetail,
        getImportations,
        getImportationById,
        goToImportation,
    };
};