// Add your custom JS code here
'use strict';

import { GET, formatDate } from './helpers.js';

const getTokenURL = `https://api.twitch.tv/helix/users?login=`;
const getVideosURL = `https://api.twitch.tv/helix/videos?user_id=`;
const state = {};

const getStreamers = function () {
  // get all the IDs from the filter buttons
  const idList = $('.btn')
    .map(function () {
      const id = $(this).data('twitchid');
      return id;
    })
    .filter((item) => {
      return typeof (item !== undefined);
    });

  const [...id] = idList;

  return id;
};

// Use if you need to get the ID to put into the yaml file
const getStreamerID = async function (id) {
  try {
    const { data } = await GET(`${getTokenURL}${id}`);

    // Add error handling incase the ID is invalid/returns undefined in the future
    return data[0].id;
  } catch (err) {
    console.error(`Unable to get streamer information${err}`);
    throw err;
  }
};

const loadVideos = async function (id) {
  try {
    const data = await GET(`${getVideosURL}${id}`);
    // Add error handling incase the ID is invalid/returns undefined in the future
    createVideoObjects(data);
  } catch (err) {
    console.error(`Unable to load video${err}`);
    throw err;
  }
};

const createVideoObjects = function (data) {
  const [...videos] = data.data;
  state[videos[0]?.user_name] = [];

  videos.forEach((video) => {
    // Automate this

    const streamers = ['growzy', 'valharl', 'foger', 'twillsie'];

    state[video.user_name].push({
      streamID: `${streamers.indexOf(video.user_name.toLowerCase()) + 1}`,
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

const displayVideos = function (state) {
  Object.entries(state)
    .flatMap((entry) => {
      if (entry[1].length > 5) return entry[1].slice(0, 5);
      return entry[1];
    })
    .reverse() // Inserts oldest videos first so they show up left to right newest -> oldest
    .forEach((v) => {
      // Setting some parameters to fill the HTML elements with
      let title = v.title;
      if (v.title.length > 50) title = `${v.title.slice(0, 51)}...`;
      const thumbnail = v.thumbnail_url.split('%{', 1)[0];
      const thumbNailSize = '1280x720.jpg';
      const date = formatDate(new Date(v.created_at.split('T', 1)[0]));
      const normalizedUserName = v.user_name.toLowerCase();

      const videoHTML = `
        <article class="stream stream-${v.streamID} has-post-thumbnail" data-id="${normalizedUserName}" data-controls="true" data-provider="twitch" data-video__id="${v.id}" data-easy-embed>
        <div class="stream__thumbnail">
          <img src="${thumbnail}${thumbNailSize}" alt="${normalizedUserName}'s video">
        </div>
        <div class="stream__icon"></div>
        <div class="stream__header">
          <div class="stream__info">
            <div class="stream__avatar">
            <img src="assets/img/icons/${normalizedUserName}.png" alt ="" width="25" height="25">
            </div>
            <h6 class="stream__title">
            ${title}
            </h6>
            <div class="stream__date">${date}</div>
          </div>
          <a href="https://twitch.tv/${normalizedUserName}" class="btn btn-twitch btn-twitch--advanced">
          <i class="fab fa-twitch">&nbsp;</i><span class="d-none d-lg-inline-block btn__text-inner">Follow ${normalizedUserName}</span>
          </a> 
        </div>
        </article>`;

      document
        .querySelector('.streams-archive')
        .insertAdjacentHTML('afterbegin', videoHTML);
    });
};

function initializeVideos(streamerIDs) {
  // return a promise
  return new Promise(async (resolve, reject) => {
    resolve(await loadVideos(streamerIDs));
  });
}

const embedVideoPlayer = function ($, window, document) {
  $.fn.easyEmbed = function (options) {
    var $that = this;

    var settings = $.extend(
      {
        // general settings
        id: $that.data('id'),
        videoID: $that.data('video__id'),
        width: $that.data('width') || 16,
        height: $that.data('height') || 9,
      },
      options
    );

    var getSource = function () {
      // we are only pulling from twitch
      return `//player.twitch.tv/?video=v${settings.videoID}&parent=${window.location.hostname}`;
    };

    var setSize = function () {
      $that.css('height', ($that.width() / settings.width) * settings.height);
    };

    var setIframe = function () {
      $that.html(
        $('<iframe>')
          .attr('src', getSource())
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('frameborder', 0)
          .attr('allowfullscreen', 1)
      );
      $that.addClass('playing-video');
    };

    if (settings.setsize) {
      setSize();

      $(window).resize(function () {
        setSize();
      });
    }

    $that
      .find('*')
      .addBack()
      .click(function () {
        setIframe();
      });

    return this;
  };

  $(document).ready(function () {
    if ($('[data-easy-embed]').length > 0) {
      $('[data-easy-embed]').each(function () {
        $(this).easyEmbed();
      });
    }
  });
};

const isotope = function () {
  var streams = $('.streams-archive'),
    matches = $('.matches-scores'),
    isotopeGrid;

  if (streams.exists()) {
    var $filter = $('.js-filter'),
      windowWidth = $(window).width(),
      layout;

    if (windowWidth > 991) {
      layout = 'fitColumns';
    } else {
      layout = 'fitRows';
    }

    isotopeGrid = streams.imagesLoaded(function () {
      isotopeGrid.isotope({
        layoutMode: layout,
        itemSelector: '.stream',
      });

      isotopeGrid.isotope('layout');

      // filter items on button click
      $filter.on('click', 'button', function () {
        var filterValue = $(this).attr('data-filter');
        $filter.find('button').removeClass('active').addClass('');
        $(this).removeClass('').addClass('active');
        isotopeGrid.isotope({
          filter: filterValue,
        });
      });
    });

    $(window).on('resize', function () {
      windowWidth = $(window).width();

      isotopeGrid.isotope('destroy');

      if (windowWidth > 991) {
        layout = 'fitColumns';
      } else {
        layout = 'fitRows';
      }

      isotopeGrid.isotope({
        layoutMode: layout,
        itemSelector: '.stream',
      });

      isotopeGrid.isotope('layout');
    });
  }

  if (matches.exists()) {
    isotopeGrid = matches.imagesLoaded(function () {
      var $filter = $('.js-filter');

      // init Isotope after all images have loaded
      isotopeGrid.isotope({
        // filter: '*',
        layoutMode: 'fitRows',
        itemSelector: '.col-md-12',
        // masonry: {
        // 	columnWidth: '.stream'
        // }
      });

      // filter items on button click
      $filter.on('click', 'li', function () {
        var filterValue = $(this).attr('data-filter');
        $filter.find('li').removeClass('active').addClass('');
        $(this).removeClass('').addClass('active');
        isotopeGrid.isotope({
          filter: filterValue,
        });
      });
    });
  }
};

// create array of promises
let streamerIDs = getStreamers().map(initializeVideos);

// runs when all promises are resolved
Promise.all(streamerIDs).then(() => {
  isotope();
  displayVideos(state);
  embedVideoPlayer(jQuery, window, document);
});
