import cultures from "./data/cultures";
import EUCountries from "./data/EUCountries";
import createMapFromRecord from "./utils/createMapFromRecord";

abstract class CultureInfo {
  private static readonly cultures = createMapFromRecord<string, string>(
    cultures
  );

  public static tryGetEnglishName(countryIso: string): string {
    const countryName = this.cultures.get(countryIso);

    if (!countryName) {
      throw new Error(`Missing English name for country code: ${countryIso}`);
    }

    return countryName;
  }

  public static isInsideEU(countryIso: string): boolean {
    return EUCountries.includes(countryIso.toUpperCase());
  }
}

export default CultureInfo;
