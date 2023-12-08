export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function checkEmail(email) {
  if (!isValidEmail(email)) {
    throw new Error(`${email} is not a valid email`);
  }
}

export const isValidUrl = (url) => {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  return url === "" || urlRegex.test(url);
};

export const checkLinks = (links) => {
  const keys = Object.keys(links);
  for (const key of keys) {
    const link = links[key];
    if (key !== '_id' && link !== "" && !isValidUrl(link)) {
      throw new Error(`${key} has an invalid link: ${link}`);
    }
  }
};