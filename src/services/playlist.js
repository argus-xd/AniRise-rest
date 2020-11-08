const qualitySettings = {
  360: {
    bandWidth: 640000,
    resolution: "640x360"
  },
  480: {
    bandWidth: 1200000,
    resolution: "720x480"
  },
  720: {
    bandWidth: 2200000,
    resolution: "1280x720"
  }
};

const makeMaster = playList => {
  const result = ["#EXTM3U"];

  playList.forEach(({ size, src }) => {
    const quality = qualitySettings[size];
    if (!quality) return;

    result.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bandWidth},RESOLUTION=${quality.resolution},CODECS="avc1.42e00a,mp4a.40.2"`
    );
    result.push(src);
  });

  return result.join("\r\n");
};

module.exports = {
  makeMaster
};
