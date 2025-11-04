const countryCodeRegex = /^[A-Z]{2}$/;

export default function isValidCountryCode(code?: string): boolean {
  if (!code) {
    return false;
  }

  return countryCodeRegex.test(code);
}
