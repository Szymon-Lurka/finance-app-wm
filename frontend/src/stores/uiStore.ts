import {defineStore} from "pinia";
import {computed} from "vue";

const useUiStore = defineStore('ui', {
    state: () => ({
        layoutConfig: {
            menuMode: 'static',
            inputStyle: 'outlined',
        },
        layoutState: {
            staticMenuDesktopInactive: false,
            overlayMenuActive: false,
            profileSidebarVisible: false,
            configSidebarVisible: false,
            staticMenuMobileActive: false,
            menuHoverActive: false
        },
    }),
    actions: {
        onMenuToggle() {
            if (this.layoutConfig.menuMode === 'overlay') {
                this.layoutState.overlayMenuActive = !this.layoutState.overlayMenuActive;
            }

            if (window.innerWidth > 991) {
                this.layoutState.staticMenuDesktopInactive = !this.layoutState.staticMenuDesktopInactive;
            } else {
                this.layoutState.staticMenuMobileActive = !this.layoutState.staticMenuMobileActive;
            }
        }
    },
    getters: {
        isSidebarActive: (state) => computed(() => state.layoutState.overlayMenuActive || state.layoutState.staticMenuMobileActive)
    }
})

export {
    useUiStore
}