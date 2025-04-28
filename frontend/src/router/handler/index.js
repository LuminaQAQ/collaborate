import router from ".."

export const toPersonalCenter = (user) => {
    router.push({
        name: 'PersonalCenter',
        params: {
            user
        }
    })
}