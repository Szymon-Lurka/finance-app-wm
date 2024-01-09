// Composable for future cache management. Including managing localStorage
import dayjs from 'dayjs';

const useCache = () => {
    const validAllKeys = () => {
        const allKeys = {...window.localStorage};

        Object.keys(allKeys).forEach((key: string) => {
            const item = getItem(key);

            if (!item || !item.data || !item.key || !item.expireTime) return;
            if (item.expireTime && dayjs(item.expireTime).isBefore(dayjs())) removeItem(item.key);
        });
    };

    const getItem = (key: string): CacheItem | null => {
        const item = window.localStorage.getItem(key);

        try {
            return JSON.parse(item);
        } catch (error) {
            console.log('Invalid JSON the localstorage item must be valid JSON!', `Error: ${error}`);
            return null;
        }
    };
    const createStructure = (key: string, data: unknown, shouldExpire = false, expireTimeInDays = 1) => {
        return JSON.stringify({
            key,
            data,
            expireTime: shouldExpire ? dayjs().add(expireTimeInDays, 'days') : null
        })
    }
    const setItem = (key: string, data: unknown, shouldExpire = false, expireTimeInDays = 1) => {
        localStorage.setItem(key, createStructure(key, data, shouldExpire, expireTimeInDays));
    }

    const removeItem = (key: string) => {
        localStorage.removeItem(key);
    }

    const checkExpireStatus = (key: string) => {
        const item = getItem(key);

        if (!item) return false;
        return dayjs(item.expireTime).isBefore(dayjs());
    };

    return {
        setItem,
        getItem,
        removeItem,
        checkExpireStatus,
        validAllKeys,
    }
};

export {
    useCache
}