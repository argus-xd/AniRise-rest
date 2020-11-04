const get = require("lodash.get");

const availableSorters = direction => ({
  date: (a, b) => {
    const aDate = new Date(a.updated_at);
    const bDate = new Date(b.updated_at);

    if (direction === "asc") {
      return aDate < bDate ? -1 : 1;
    }

    return aDate < bDate ? 1 : -1;
  },
  rating: (a, b) => {
    const aRating = get(a, "material_data.shikimori_rating", 0);
    const bRating = get(b, "material_data.shikimori_rating", 0);

    if (direction === "asc") {
      return aRating - bRating;
    }

    return bRating - aRating;
  }
});

const select = (sorterName, direction) =>
  availableSorters(direction)[sorterName] || availableSorters(direction).date;

module.exports = {
  select
};
