// Add your custom JS code here
'use strict';

import { FOGER_ID, VALHARL_ID, TWILLSIE_ID, GROWZY_ID } from './config.js';
import { GET, formatDate } from './helpers.js';

const state = {};

const getTokenURL = `https://api.twitch.tv/helix/users?login=`;
const getVideosURL = `https://api.twitch.tv/helix/videos?user_id=`;

const displayVideos = async function (state) {
  Object.entries(state)
    .flatMap((entry, i) => {
      console.log(entry);
      entry[1].streamID = i;
      if (entry[1].length > 5) return entry[1].slice(0, 5);

      return entry[1];
    })
    .reverse()
    .forEach((v) => {
      let title = v.title;
      if (v.title.length > 71) title = v.title.slice(0, 71);
      const thumbnail = v.thumbnail_url.split('%{', 1)[0];
      const thumbNailSize = '1280x720.jpg';
      const date = formatDate(new Date(v.created_at.split('T', 1)[0]));

      const videoHTML = `
        <article class="stream stream-${
          v.user_id
        } has-post-thumbnail" data-controls="true" data-provider="twitch" data-id="${
        v.user_name
      }" data-thumbnail="" data-easy-embed>
        <div class="stream__thumbnail">
          <img src="${thumbnail}${thumbNailSize}" alt="">
        </div>
        <div class="stream__icon"></div>
        <div class="stream__header">
          <div class="stream__info">
            <div class="stream__avatar">
            <img src="assets/img/icons/${v.user_name.toLowerCase()}.png" alt ="" width="25" height="25">
            </div>
            <h6 class="stream__title">
              ${title}
            </h6>
            <div class="stream__date">${date}</div>
          </div>
          <a href="#" class="btn btn-twitch btn-twitch--advanced">
            <i class="fab fa-twitch">&nbsp;</i><span class="d-none d-lg-inline-block btn__text-inner">Follow ${
              v.user_name
            }</span>
          </a>
        </div>
        </article>`;

      document
        .querySelector('.streams-archive')
        .insertAdjacentHTML('afterbegin', videoHTML);
    });
};

const createVideoObjects = function (data) {
  const [...videos] = data.data;
  state[videos[0]?.user_name] = [];

  videos.forEach((video) => {
    state[video.user_name].push({
      user_name: video.user_name,
      id: video.id,
      user_id: video.user_id,
      title: video.title,
      url: video.url,
      created_at: video.created_at,
      thumbnail_url: video.thumbnail_url,
    });
  });
};

const loadVideos = async function (id) {
  try {
    const data = await GET(`${getVideosURL}${id}`);

    // Add error handling incase the ID is invalid/returns undefined
    createVideoObjects(data);
  } catch (err) {
    console.error(`Unable to load video${err}`);
    throw err;
  }
};

const init = async function () {
  await loadVideos(GROWZY_ID);
  await loadVideos(VALHARL_ID);
  await loadVideos(FOGER_ID);
  // await loadVideos(123456789);
  await loadVideos(TWILLSIE_ID);
  await displayVideos(state);
};
init();
