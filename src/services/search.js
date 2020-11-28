const SphinxClient = require("sphinxapi");
const config = require("../config").sphinx;
const cacheContainer = require("../cache-container");

const sphinx = new SphinxClient();
sphinx.SetServer(config.host, config.port);
sphinx.SetMatchMode(SphinxClient.SPH_MATCH_EXTENDED);
sphinx.SetRankingMode(SphinxClient.SPH_RANK_SPH04);

module.exports = (term, resolveIds = false) => {
  return new Promise(resolve => {
    sphinx.Query(term || "", "anime", (err, result) => {
      if (err) return resolve([]);

      if (resolveIds) {
        return resolve(
          result.matches.map(({ attrs }) => Number(attrs.shikimoriid))
        );
      }

      const results = [];

      result.matches.forEach(({ attrs }) => {
        const animeFound = cacheContainer
          .animeList()
          .find(({ shikimoriId }) => shikimoriId === Number(attrs.shikimoriid));

        if (animeFound) results.push(animeFound);
      });

      resolve(results);
    });
  });
};
