function getTimestamp() {

    const date = new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
};

export { getTimestamp }