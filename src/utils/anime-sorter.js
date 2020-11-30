const availableSorters = direction => ({
  date: (a, b) => {
    if (direction === "asc") {
      return a.updatedAt - b.updatedAt;
    }

    return b.updatedAt - a.updatedAt;
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
