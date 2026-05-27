import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginStore } from "../components/store/loginStore";
import { successToast, errorToast } from "../services/toasts";
import {
    getImportationsService,
    getImportationByIdService,
} from "../services/importationService";

export const useImportation = ({ fetchOnMount = false } = {}) => {
    const { token } = useLoginStore();
    const navigate = useNavigate();
    const [importations, setImportations] = useState<Importation[]>([]);
    const [selectedImportation, setSelectedImportation] = useState<Importation | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
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

    const createImportation = async (values: CreateImportationDTO) => {
        setLoadingCreate(true);
        try {
            const newImportation = await createImportationService(values, token);
            setImportations((prev) => [...prev, newImportation]);
            successToast("Importación añadida con éxito");
            return newImportation;
        } catch {
            errorToast("Error al añadir la importación");
        } finally {
            setLoadingCreate(false);
        }
    };

    const goToImportation = () => navigate("/importation");

    useEffect(() => {
        if (fetchOnMount) getImportations();
    }, []);

    return {
        importations,
        selectedImportation,
        loading,
        loadingCreate,
        loadingDetail,
        getImportations,
        getImportationById,
        createImportation,
        goToImportation,
    };
};