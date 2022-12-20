declare abstract class CultureInfo {
    private static readonly cultures;
    static tryGetEnglishName(countryIso: string): string;
    static isInsideEU(countryIso: string): boolean;
    static tryGetCountryIso(countryNameOrIso: string): string;
}
export default CultureInfo;
