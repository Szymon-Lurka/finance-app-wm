import {ElMessage, ElMessageBox, ElNotification} from 'element-plus';

const useElNotifications = () => {
    const dispatchConfirmMessageBox = async (
        title: string,
        message: string,
        cancelMessage: string
    ) => {
        try {
            await ElMessageBox.confirm(title, message, {
                confirmButtonText: 'Tak',
                cancelButtonText: 'Anuluj',
                type: 'warning',
            });
            return true;
        } catch (e) {
            if (e === 'cancel') {
                ElMessage({
                    type: 'info',
                    message: cancelMessage,
                });
            }
            return false;
        }
    };
    const dispatchErrorMessage = (message: string) => {
        ElMessage({
            type: 'error',
            message,
        });
    };
    const dispatchSuccessMessage = (message: string) => {
        ElMessage({
            type: 'success',
            message,
        });
    };
    const dispatchInfoMessage = (message: string) => {
        ElMessage({
            type: 'info',
            message,
        });
    };
    const dispatchSuccessNotification = (message: string, title: string) => {
        ElNotification({
            type: 'success',
            message,
            title,
        });
    };
    const dispatchErrorNotification = (message: string, title: string) => {
        ElNotification({
            type: 'error',
            message,
            title,
        });
    };

    return {
        dispatchConfirmMessageBox,
        dispatchErrorMessage,
        dispatchSuccessMessage,
        dispatchInfoMessage,
        dispatchSuccessNotification,
        dispatchErrorNotification,
    };
};

export {useElNotifications};
