import {defineStore} from "pinia";

const useUiStore = defineStore('ui', {
    state: () => ({
        menuStatus: false
    }),
    actions: {
        toggleMenu() {
            this.menuStatus = !this.menuStatus;
        },
        setMenu(status: boolean) {
            this.menuStatus = status;
        },
    },
    getters: {
        isMenuOpen: (state) => state.menuStatus
    }
})

export {
    useUiStore
}