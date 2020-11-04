module.exports = (limit, from, to) => {
  limit = Number(limit) || to;

  if (limit < from) return from;
  if (limit > to) return to;

  return limit;
};
