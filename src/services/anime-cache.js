const init = async updateIntervalMinutes => {
  await updateCache();

  setInterval(updateCache, updateIntervalMinutes * 60000);
};

const updateCache = async () => {
  console.log("anime cache updated");
};

module.exports = {
  init
};
