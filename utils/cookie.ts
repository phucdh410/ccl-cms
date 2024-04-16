export const setCookie = (name: string, value: any, days: number) => {
  if (typeof window !== "undefined") {
    const jsonValue = JSON.stringify(value);

    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + jsonValue + ";" + expires + ";path=/";
  }
};

export const getCookie = (name: string) => {
  if (typeof window !== "undefined") {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
  }
  return "";
};
