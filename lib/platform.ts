export function getPlatformLogo(referralLink: string) {
  try {
    const link = new URL(referralLink);
    const hostname = link.hostname.replace(/^www\./, "");
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return "";
  }
}
