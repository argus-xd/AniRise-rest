const availableSorters = direction => ({
  date: (a, b) => {
    const aDate = new Date(a.updatedAt);
    const bDate = new Date(b.updatedAt);

    if (direction === "asc") {
      return aDate < bDate ? -1 : 1;
    }

    return aDate < bDate ? 1 : -1;
  },
  rating: (a, b) => {
    if (direction === "asc") {
      return a.rating - b.rating;
    }

    return b.rating - a.rating;
  }
});

const select = (sorterName, direction) =>
  availableSorters(direction)[sorterName] || availableSorters(direction).date;

module.exports = {
  select
};
