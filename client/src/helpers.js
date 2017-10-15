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

export const getFreeSpotsColor = (freeSpots, isFuture) => {
    const alpha = isFuture ? .5 : 1;
    if (freeSpots === 0) {
        return `rgba(215, 36, 0, ${alpha})`;
    } else if (freeSpots > 0 && freeSpots <= 5) {
        return `rgba(255, 98, 0, ${alpha})`;
    } else if (freeSpots > 5 && freeSpots <= 10) {
        return `rgba(232, 163, 0, ${alpha})`;
    } else if (freeSpots > 10) {
        return `rgba(0, 186, 3, ${alpha})`;
    }
}
