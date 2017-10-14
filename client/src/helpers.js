export const getFreeSpotsClassName = (freeSpots) => {
    let sufix;
    if (freeSpots === 0) {
        sufix = 'nospace';
    } else if (freeSpots > 0 && freeSpots <= 5) {
        sufix = 'shortage';
    } else if (freeSpots > 5 && freeSpots <= 10) {
        sufix = 'enough';
    } else if (freeSpots > 10) {
        sufix = 'good';
    }
    return `parking-spot parking-spot--${sufix}`;
}

export const getFreeSpotsColor = (freeSpots) => {
    if (freeSpots === 0) {
        return 'rgb(215, 36, 0)';
    } else if (freeSpots > 0 && freeSpots <= 5) {
        return 'rgb(255, 98, 0)';
    } else if (freeSpots > 5 && freeSpots <= 10) {
        return 'rgb(232, 163, 0)';
    } else if (freeSpots > 10) {
        return 'rgb(0, 186, 3)';
    }
}
