import { useDocStore } from "@/stores/doc";
/**
 * 
 * @param {import("vue").VueElement} el 
 * @param {import("vue").DirectiveBinding} binding 
 * @returns 
 */
const handlePermission = (el, binding) => {
    const docStore = useDocStore();
    if (!docStore.currentDocState.role.book && !docStore.currentDocState.role.doc) return;

    if (Array.isArray(binding.value)) {
        const isLegal = binding.value.some(item => {
            const [type, permission] = item.split(":");

            return docStore.currentDocState.role[type] === permission;
        })

        if (!isLegal) el.parentNode?.removeChild(el);
    }
}

export default {
    /**
     * 
     * @param {import("vue").App} app 
     */
    install(app) {
        app.directive("permission", {
            mounted(el, binding) {
                handlePermission(el, binding);
            }
        })
    }
}