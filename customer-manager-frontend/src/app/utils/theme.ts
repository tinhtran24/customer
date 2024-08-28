export const getThemeBg = (theme = true) => {
    return theme ? {
        backgroundColor: 'rgba(73, 82, 123, 0.3)',
        color: 'rgba(255, 255, 255, 1)'
    } : {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        color: 'rgba(0, 0, 0, 1)'
    }
}