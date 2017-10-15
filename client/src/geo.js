const getUserDistanceToSpot = (spotCspotCoordinates, userCoordinates) => {
    if (!window.google) {
        return null;
    }
    console.log(typeof window.google, typeof window.google.maps);
    return `${5}km`;
};

module.exports = {
    getUserDistanceToSpot,
};
