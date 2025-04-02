import { useDocStore } from "@/stores/doc";

export default {
    /**
     * 
     * @param {import("vue").App} app 
     */
    install(app) {
        app.directive("permission", {
            mounted(el, binding) {
                const docStore = useDocStore();
                if (Array.isArray(binding.value)) {
                    const isLegal = binding.value.some(item => {
                        const [type, permission] = item.split(":");

                        console.log(docStore.currentDocState[type], permission)

                        return docStore.currentDocState[type] === permission;
                    })

                    if (!isLegal) el.parentNode.removeChild(el);
                }
            }
        })
    }
}