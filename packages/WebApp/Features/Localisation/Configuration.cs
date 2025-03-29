namespace WebApp.Features.Localisation;

public static class LocalisationConfiguration
{
    private static string[] supportedCultures = ["en-GB"];
    public static string[] SupportedCultures => supportedCultures;
    public static string DefaultCulture => supportedCultures[0];
}
