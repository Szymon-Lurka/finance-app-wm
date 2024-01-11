import type {ToastBody} from "@/types/models/Toasts";
import {useToast} from "primevue/usetoast";

const useToastsService = () => {
    const toast = useToast();
    const dispatchSuccessToast = (body: ToastBody) => {
        toast.add({detail: body.details, life: body.timeMS ? body.timeMS : 3000, severity: 'success', summary: body.title})
    };
    const dispatchErrorToast = (body: ToastBody) => {
        toast.add({detail: body.details, life: body.timeMS ? body.timeMS : 3000, severity: 'error', summary: body.title})
    };
    return {
        dispatchErrorToast,
        dispatchSuccessToast
    }
}

export {
    useToastsService
}