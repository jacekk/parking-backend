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
