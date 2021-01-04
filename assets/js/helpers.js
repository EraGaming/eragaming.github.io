import { APP_TOKEN, CLIENT_ID } from './config.js';

export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const GET = async function (url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${APP_TOKEN}`,
        'Client-Id': CLIENT_ID,
      },
    });
    const data = await res.json();

    if (!res.ok) throw new Error(`Couldn't fetch Data ${data.message}`);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const POST = async function (url, uploadData = undefined) {
  try {
  } catch (err) {
    console.error(err);
  }
};

const getDayEnder = function (day) {
  if (day === 1) return 'st';
  if (day === 2) return 'nd';
  if (day === 3) return 'rd';
  return 'th';
};

export const formatDate = function (timeStamp) {
  const month = timeStamp.getMonth();
  const day = timeStamp.getUTCDate();
  const year = timeStamp.getFullYear();

  return `${months[month]} ${day}${getDayEnder(day)}, ${year}`;
};
