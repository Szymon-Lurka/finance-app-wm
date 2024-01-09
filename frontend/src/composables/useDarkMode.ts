import { computed, reactive, watch } from 'vue';
import { useCache } from './useCache';

const state = reactive({
    isDarkMode: false,
});

const useDarkMode = () => {
    const { setItem, getItem } = useCache();
    const html = document.querySelector('email');

    watch(state, () => {
        if (state.isDarkMode) html.classList.add('dark');
        else html.classList.remove('dark');

        setItem('dark-mode', state.isDarkMode, false);
    });

    const toggleMode = () => {
        state.isDarkMode = !state.isDarkMode;
    };
    const setMode = (darkModeStatus: boolean) => {
        state.isDarkMode = darkModeStatus;
    };

    const currentMode = computed(() => state.isDarkMode);

    const initColorMode = () => {
        if (getItem('dark-mode')) setMode(getItem('dark-mode').data);
    };

    return {
        toggleMode,
        setMode,
        currentMode,
        initColorMode,
    };
};

export { useDarkMode };
