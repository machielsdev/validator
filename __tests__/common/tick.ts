export default (): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(resolve, 0);
    })
}
